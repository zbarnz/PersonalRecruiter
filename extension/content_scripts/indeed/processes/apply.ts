import {
  longWait,
  mediumWait,
  shortWait,
  tinyWait,
  waitForElement,
} from "../../../lib/utils/waits";

import { Listing } from "../../../src/entity/Listing";
import { AutoApply } from "../../../src/entity/AutoApply";
import { User } from "../../../src/entity/User";

import { standardizeIndeedApplyUrl } from "../../../lib/utils/parsing";
import { filterQuestionsObjects } from "../../../lib/utils/indeed";

import { handleContactInfoPage } from "../apply_page_handlers/handleContactInfoPage";
import { handleDocumentsPage } from "../apply_page_handlers/handleDocumentsPage";
import {
  handleQuestionsPage,
  isErrorPresent,
} from "../apply_page_handlers/handleQuestionsPage";
import { handleResumePage } from "../apply_page_handlers/handleResumePage";
import { handleReviewPage } from "../apply_page_handlers/handleReviewPage";
import { handleWorkExperiencePage } from "../apply_page_handlers/handleWorkExperiencePage";
import { getInitialDataInjection } from "./getInitialData";

import { readLocalStorage } from "../../../lib/utils/chrome/storage";

const apiUrl = "http://localhost:4000/api";

type JobDetails = {
  jobKey: any;
  showExperienceFlag: boolean;
  requiredQualifications: any;
  listing: Listing;
  questionsUrl: string;
};

chrome.runtime.onMessage.addListener(startApplyListner);
chrome.runtime.onMessage.addListener(beginApplyFlow);

async function startApplyListner(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  if (message.action == "startApply") {
    clickApplyButton();
  }
}

async function clickApplyButton() {
  const applyButton: HTMLElement = document.querySelector(
    "#indeedApplyButton"
  ) as HTMLElement;

  if (applyButton) {
    applyButton.click();
  } else {
    throw new Error("Cannot Find Apply Button ");
  }
}

function isIqURL(url: string): boolean {
  if (url) {
    console.log("is IQ?: " + url);
    //check if a url is a indeed  URL scheme
    // Regular expression to match the format 'iq://<some characters>'
    const pattern = /^iq:\/\/[^\s]+$/;
    return pattern.test(url);
  } else {
    throw new Error("Missing question url");
  }
}

async function getQuestions(
  initialData: any,
  questionsURL: any
): Promise<any[] | null> {
  const isIndeedURL = isIqURL(questionsURL);
  let questions: any[] = [];

  if (isIndeedURL) {
    questions = initialData.screenerQuestions;

    if (questions.length) {
      questions = filterQuestionsObjects(questions);
    }
  } else {
    let questions;

    questions = initialData.screenerQuestions;

    if (!questions.length && questionsURL) {
      console.log("\n \nREQUESTING QUESTIONS \n \n");

      const res = await fetch(decodeURIComponent(questionsURL));
      questions = await res.json();
    }

    if (questions.length) {
      questions = filterQuestionsObjects(questions);
    }
  }

  if (questions.length) {
    console.log("got questions: \n" + JSON.stringify(questions));
    return questions;
  } else {
    return null;
  }
}

async function beginApplyFlow(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  if (message.action == "beginApplyFlow") {
    console.log("beginning apply flow...");

    await getInitialDataInjection();
    const initialData = window._initialData;

    const jobDetails: JobDetails = await readLocalStorage(
      "currentListingContext"
    );
    const user: User = await readLocalStorage("user");
    const listing: Listing = jobDetails.listing;

    let url: string;
    let matched = null;
    let questions: any[] | null = [];

    const questionsUrl = jobDetails.questionsUrl || initialData.hr?.questions;

    const coverLetterFlag = initialData.hr.coverLetter;

    if (questionsUrl) {
      console.log("getting questions");
      questions = await getQuestions(initialData, questionsUrl);
    }

    let getCoverLetter: boolean =
      coverLetterFlag && coverLetterFlag !== "hidden" ? true : false;
    let getResume: boolean = user.customResumeFlag;

    let answeredQuestions: any[] | null = [];

    console.log("Creating AutoApply and getting documents!");

    const autoApply = new AutoApply();

    autoApply.listing = listing;
    autoApply.user = user;
    autoApply.customResumeFlag = getResume;
    autoApply.customCoverLetterFlag = getCoverLetter;

    const res = await fetch(`${apiUrl}/autoApply/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        autoApply: autoApply,
        getCoverLetter: getCoverLetter,
        getResume: getResume,
        questions: questions,
      }),
    });

    if (res.status != 200) {
      throw new Error(
        "Failed to create autoApply: " + JSON.stringify(await res.json())
      );
    }

    const {
      savedApply,
      documents,
    }: { savedApply: AutoApply; documents: Documents } = await res.json();
    answeredQuestions = documents.answeredQuestions;

    console.log("got documents");
    console.log(documents);

    while (
      location.href.includes("m5.apply.indeed") ||
      location.href.includes("smartapply.indeed")
    ) {
      //page.waitForLoadState("networkidle"); //TODO think of a better way
      await waitForElement(".gnav", false);
      url = location.href;
      let retry: number = 0;
      let maxUrlRetries: number = 3; //if no matching url is found

      const continueButtonSelector = ".ia-BasePage-footer button";
      const disabledButtonSelector =
        ".ia-BasePage-footer button:not([disabled])";

      console.log("entering: " + url);
      // Check for the specific pattern for questions URL

      url = standardizeIndeedApplyUrl(url);

      if (
        /^https:\/\/m5\.apply\.indeed\.com\/beta\/indeedapply\/form\/questions\/\d+$/.test(
          url
        )
      ) {
        matched = "questionsPattern";
      }

      if (/^https:\/\/www\.indeed\.com\/.+/.test(url)) {
        matched = "indeedPattern";
      }

      switch (matched || url) {
        case "https://m5.apply.indeed.com/beta/indeedapply/form/contact-info":
          await waitForElement(continueButtonSelector, false);
          await handleContactInfoPage("Zach", "Barnes");
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/resume":
          await waitForElement(continueButtonSelector, false);
          await handleResumePage(documents.resume);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "questionsPattern":
          await waitForElement(continueButtonSelector, false);
          if (answeredQuestions && answeredQuestions.length) {
            await handleQuestionsPage(answeredQuestions);
          }
          matched = undefined; //clear matched variable
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          if (await isErrorPresent()) {
            //check if previous question page has an error
            throw new Error(
              "Theres an error on the page. Did a question get missed?"
            );
          }
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/work-experience":
          await waitForElement(continueButtonSelector, false);
          await handleWorkExperiencePage(
            "SQL Developer",
            "Vistar - A PFG Company"
          );
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/review":
          await waitForElement(continueButtonSelector, false);
          //TODO reintroduce below
          // await handleReviewPage(
          //   aiStructuredResume,
          //   jobDescription,
          //   listing,
          //   user
          // );
          (
            document.querySelector(continueButtonSelector) as HTMLElement
          )?.click();
          await waitForElement(disabledButtonSelector, false);
          //TODO reintroduce below
          await waitForElement(".ia-PostApply-header", false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/post-apply": //final page
          await waitForElement("#continueButton", false);
          (document.querySelector("#continueButton") as HTMLElement)?.click();
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/profile-location":
          await waitForElement(continueButtonSelector, false);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/postresumeapply":
          await waitForElement(continueButtonSelector, false);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/qualification-questions":
          await waitForElement(continueButtonSelector, false);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/qualification-intervention":
          await waitForElement(continueButtonSelector, false);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "https://m5.apply.indeed.com/beta/indeedapply/form/documents":
          await waitForElement(continueButtonSelector, false);

          await handleDocumentsPage(documents.coverLetter);
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        default:
          retry++;
          console.log("could not find URL. Retying");
          break;
      }

      await shortWait();

      if (retry >= maxUrlRetries) {
        throw new Error(`No matching url found for ${url}`);
      }

      url = location.href;
    }

    const completeMessage = {
      message: "applyComplete",
      autoApply,
    };

    console.log("sending apply complete message");
    console.log(completeMessage);
  }
}
