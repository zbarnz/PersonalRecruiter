import { ENV } from "../../../env";
import { apiBaseUrl } from "../../../apiConfig";
import { waitForElement } from "../../../lib/utils/waits";

const { LISTING_LIMIT_PER_PAGE } = ENV;

chrome.runtime.onMessage.addListener(getInitialData);

//Save to jobs to chrome:

async function getInitialData(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  console.log("scraper script received message");

  if (message.message == "getInitialData") {
    console.log("Starting scraping!");

    if (message.getContext) {
      await waitForElement("#indeedApplyButton", true);
    }

    //set script run listener
    window.addEventListener("message", (event) => {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (event.data.type && event.data.type === "FROM_PAGE") {
        let contextData: any;

        if (message.getContext) {
          const scriptElement = document.querySelector(
            'script[type="application/ld+json"]'
          );
          contextData = scriptElement ? scriptElement.textContent : null;
          contextData = JSON.parse(String(contextData));
        }

        const initialData = JSON.parse(event.data.text);

        window._initialData = initialData;

        console.log("sending Initial Data Set Message:");
        console.log({
          message: "initialDataSet",
          initialData: initialData,
          process: message.process,
          context: contextData,
        });

        chrome.runtime.sendMessage({
          message: "initialDataSet",
          initialData: initialData,
          process: message.process,
          context: contextData,
        });
      }
    });

    //inject script
    const scriptUrl = chrome.runtime.getURL(
      "build/content_scripts/indeed/injections/getInitialData.js"
    );
    const script = document.createElement("script");
    script.src = scriptUrl;
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => {
      script.remove(); // Clean up after injection
    };
  }
}
