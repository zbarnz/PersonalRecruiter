import { User } from "../../background/entity/User";
import { AutoApply } from "../../background/entity/AutoApply";

import {
  waitForNavigationComplete,
  waitForURL,
  waitForElement,
  shortWait,
  tinyWait,
  mediumWait,
} from "../../lib/utils/waits";

async function main(user: User, summarizeDescription: boolean) {
  const desiredMinSalary = 100000;
  const wantRemote = true;
  const skillsArray = [
    "REACT",
    "NEXT.JS",
    "MONGODB",
    "GRAPHQL",
    "NEST.JS",
    "POSTGRESQL",
    "PRISMA",
    "EXPRESS",
    "APOLLO",
    "SQL SERVER",
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "GIT",
    "Docker",
    "Axios",
    "Mocha",
    "Mongoose",
    "MUI",
    "ChatGPT API",
    "Node.js",
    "SQL",
    "Puppeteer",
    "C++",
  ];

  let showExperienceFlag: boolean;
  let answeredQuestions: any[] = [];
  let questions: any;

  try {
    const listings = await findUnappliedListing(
      user,
      desiredMinSalary,
      wantRemote,
      skillsArray,
      false,
      1
    );

    const listing = listings[0];

    //create autoApply record to be saved once complete

    const autoApply = new AutoApply();

    autoApply.listing = listing;
    autoApply.user = user;
    autoApply.dateApplied = Math.floor(Date.now() / 1000);

    console.log(
      "Found Listing:",
      listing.title + `\n` + "listingID: " + listing.jobListingId
    );

    const message: NavigateMessage = {
      action: "navigate",
      url: `https://www.indeed.com/viewjob?jk=${listing.jobListingId}`,
    };

    chrome.runtime.sendMessage(message);

    //what from reply from background task
    await waitForNavigationComplete();

    const signInButtonSelector = 'div[data-gnav-element-name="SignIn"] a';
    const navSelector = ".gnav";

    await waitForElement(navSelector);
    await shortWait();

    const signInButton = document.querySelector(signInButtonSelector);

    if (signInButton) {
      const message: NavigateMessage = {
        action: "navigate",
        url: `https://secure.indeed.com/auth`,
      };

      chrome.runtime.sendMessage(message);

      //wait from reply from background task
      await waitForNavigationComplete();

      //wait for user sign in
      await waitForURL("https://secure.indeed.com/settings/account");
      console.log("User Signed in");

      await shortWait();
    }

    const isCloudflare = await cloudflareCheck(page);

    if (isCloudflare) {
      throw new Error("Cloudflare detected!");
    }

    const content = await page.evaluate(() => {
      const scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      );
      return scriptElement ? scriptElement.textContent : null;
    });

    let applyButton = await page.$("#indeedApplyButton");

    if (!applyButton) {
      await closeListing(listing.id);
      console.log("Listing closed");
      return { page, browser };
    }

    if (await applyButton.isDisabled()) {
      await createApply(autoApply);
      console.log("Listing already applied");
      return { page, browser };
    }

    console.log("Waiting for Initial Data");
    await page.waitForFunction("window._initialData !== undefined");

    let initialData = await page.evaluate(() => {
      return window._initialData;
    });

    console.log("Gathering Page information");

    const applyButtonAttributes: IndeedApplyButtonAttributes =
      initialData.indeedApplyButtonContainer.indeedApplyButtonAttributes;

    console.log(
      `applyButtonAttributes \n` + JSON.stringify(applyButtonAttributes)
    );

    if (initialData.pageMetadata) {
      showExperienceFlag = //indeed will ask you about experiencelk
        initialData.pageMetadata.showWorkExperienceFields ||
        initialData.pageMetadata.showWorkExperienceAndLocationFields;
    } else {
      showExperienceFlag = false;
    }

    const requiredQualifications =
      initialData?.jobInfoWrapperModel?.jobInfoModel?.jobDescriptionSectionModel
        ?.qualificationsSectionModel?.content || null;
    let jobDescription: string = listing.description;
    const jobTitle: string = listing.title;
    const jobCompanyName = listing.company;

    const resumeFolder = path.join(
      __dirname,
      "../../../../src/otherApplyAssets/resumes/"
    );

    const resumeFileName = sanitizeFilename(
      jobCompanyName +
        "_" +
        jobTitle +
        "_resume_" +
        listing.jobListingId +
        ".pdf"
    );

    const createResumeAtPath = resumeFolder + resumeFileName;

    let questionsURL;
    //let questionsURL = applyButtonAttributes.questions;

    // if (!questionsURL) {
    //   //TODO figure out a cleaner way to do this
    //   await shortWait(page);
    //   await page.reload();
    //   await tinyWait(page);
    //   console.log("Waiting for Initial Data");
    //   await page.waitForFunction("window._initialData !== undefined");
    //   let initialData = await page.evaluate(() => {
    //     return window._initialData;
    //   });
    //   questionsURL =
    //     initialData.indeedApplyButtonContainer.indeedApplyButtonAttributes
    //       .questions;
    //   console.log("cant find questions link on job page, trying apply page");
    //   await page.waitForSelector("#indeedApplyButton");
    //   applyButton = await page.$("#indeedApplyButton");
    // }

    await applyButton.click();

    await Promise.race([
      page.waitForURL("https://m5.apply.indeed.com/**"),
      page.waitForURL("https://smartapply.indeed.com/**"),
    ]);

    //check for verify email
    if (
      page.url() ==
      "https://smartapply.indeed.com/beta/indeedapply/form/verify-account"
    ) {
      throw new Error("Must verify account");
    }

    if (!questionsURL) {
      await page.waitForFunction("window._initialData !== undefined");
      let initialData = await page.evaluate(() => {
        return window._initialData;
      });
      questionsURL =
        applyButtonAttributes.questions || initialData.hr?.questions;
      // if (!questionsURL) {
      //   throw new Error("cannot find questions url");
      // }
    }

    const isIndeedURL = isIqURL(questionsURL);
    console.log("result: " + isIndeedURL);

    let res: AxiosResponse<any, any>;

    if (summarizeDescription) {
      jobDescription = await summarizeJobDescription(
        jobCompanyName,
        jobDescription,
        listing,
        user
      );

      if (requiredQualifications) {
        let qualificationsString = "\n\nMinimum Qualifications:\n";
        for (const key in requiredQualifications) {
          if (requiredQualifications.hasOwnProperty(key)) {
            qualificationsString +=
              requiredQualifications[key].join("\n") + "\n";
          }
        }

        // Append qualifications to jobDescription
        jobDescription += qualificationsString;
      }
    }

    const improvedResume = await getResume(
      skillsArray,
      jobDescription,
      user,
      listing
    ); // will need to rewrite this function or have a standard resume

    await compileResumeToPDF(
      improvedResume,
      path.join(__dirname, "../../../../src/otherApplyAssets/resumePage2.pdf"),
      createResumeAtPath
    );
    const resumePath = createResumeAtPath;
    console.log("resume path: " + resumePath);

    console.log("questionsUrl: " + questionsURL);

    if (questionsURL) {
      if (isIndeedURL) {
        initialData = await page.evaluate(() => {
          //reassign initial data
          return window._initialData;
        });

        let questions = initialData.screenerQuestions;

        console.log(questions);

        //sometimes there may be no questions does this ever mean it failed?
        // if (questions.length < 1) {
        //   throw new Error("No questions found before filtering");
        // }

        if (questions.length) {
          questions = filterQuestionsObjects(questions);

          console.log("filtered questions: \n" + JSON.stringify(questions));

          // if (questions.length < 1) {
          //   throw new Error("No questions found after filtering");
          // }
          if (questions.length) {
            answeredQuestions = await answerQuestionsIq(
              questions,
              aiStructuredResume,
              jobDescription,
              user,
              listing,
              autoApply
            );
          }
        }

        // answeredQuestions = [];

        console.log(
          "answered questions: \n" + JSON.stringify(answeredQuestions)
        );
      } else {
        let questions;

        initialData = await page.evaluate(() => {
          //reassign initial data
          return window._initialData;
        });

        questions = initialData.screenerQuestions;

        if (!questions.length) {
          console.log("\n \n WARNING REQUESTING QUESTIONS \n \n");

          const res = await axios.get(
            decodeURIComponent(applyButtonAttributes.questions)
          ); //ignore information type questions

          questions = res.data;
        }

        //sometimes there may be no questions does this ever mean it failed?
        // if (questions.length < 1) {
        //   throw new Error("No questions found before filtering");
        // }

        if (questions.length) {
          questions = filterQuestionsObjects(questions);

          console.log("filtered questions: \n" + JSON.stringify(questions));

          // if (questions.length < 1) {
          //   throw new Error("No questions found after filtering");
          // }

          if (questions.length) {
            answeredQuestions = await answerQuestions(
              questions,
              aiStructuredResume,
              jobDescription,
              user,
              listing,
              autoApply
            );
          }
        }

        answeredQuestions = [];

        console.log(
          "answered questions: \n" + JSON.stringify(answeredQuestions)
        );
      }
    }

    await applyFlow(
      page,
      answeredQuestions,
      questions,
      listing,
      resumePath,
      aiStructuredResume,
      jobDescription,
      user,
      autoApply
    );
    //await closeListing(listing.id)

    return { browser, page };
  } catch (err) {
    console.log(err);
    //browser.close();
  }
}
