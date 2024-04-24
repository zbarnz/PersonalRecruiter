import {
  longWait,
  mediumWait,
  shortWait,
  tinyWait,
  waitForElement,
} from "../../../lib/utils/waits";

import { Listing } from "../../../src/entity/Listing";

import { standardizeIndeedApplyUrl } from "../../../lib/utils/parsing";

import { handleContactInfoPage } from "../apply_page_handlers/handleContactInfoPage";
import { handleDocumentsPage } from "../apply_page_handlers/handleDocumentsPage";
import {
  handleQuestionsPage,
  isErrorPresent,
} from "../apply_page_handlers/handleQuestionsPage";
import { handleResumePage } from "../apply_page_handlers/handleResumePage";
import { handleReviewPage } from "../apply_page_handlers/handleReviewPage";
import { handleWorkExperiencePage } from "../apply_page_handlers/handleWorkExperiencePage";

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

async function beginApplyFlow(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  if (message.action == "beginApplyFlow") {
    console.log("beginning apply flow...");

    console.log("testing wait at: " + new Date().getSeconds() + " seconds");
    await longWait();
    console.log("finished at: " + new Date().getSeconds() + " seconds");

    let url: string;
    let matched = null;

    //need to get these:
    let aiStructuredResume = "";
    let jobDescription = "";
    let listing: Listing;
    let user = "";
    let autoApply = "";
    let answeredQuestions: any[] = [];

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
          await handleResumePage();
          await (
            document.querySelector(continueButtonSelector) as HTMLElement
          ).click();
          await waitForElement(disabledButtonSelector, false);
          break;

        case "questionsPattern":
          await waitForElement(continueButtonSelector, false);
          if (answeredQuestions.length) {
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
          // if (!isVisible) {
          //   continue;
          // } //will sometimes render an invisible version on page
          //TODO reintroduce below
          // await handleReviewPage(
          //   aiStructuredResume,
          //   jobDescription,
          //   listing,
          //   user
          // );
          (document.querySelector("#continueButton") as HTMLElement)?.click();
          await waitForElement(disabledButtonSelector, false);
          //TODO reintroduce below
          // await createApply(autoApply);
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
          await waitForElement(disabledButtonSelector, false);
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
          //TODO reintroduce below
          // const { clPath, clText } = await generateCoverLetter(
          //   aiStructuredResume,
          //   jobDescription,
          //   listing,
          //   user
          // );
          // await handleDocumentsPage(clText);
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
  }
}
