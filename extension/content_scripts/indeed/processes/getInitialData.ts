import { Context } from "vm";
import { waitForElement } from "../../../lib/utils/waits";

chrome.runtime.onMessage.addListener(getInitialData);

//Save to jobs to chrome:
export async function getInitialDataInjection(message?: any) {
  return new Promise((resolve, reject) => {
    window.addEventListener("message", (event) => {
      // We only accept messages from ourselves
      if (event.source !== window) return;

      if (event.data.type && event.data.type === "FROM_PAGE") {
        let contextData;

        if (message && message.getContext) {
          const scriptElement = document.querySelector(
            'script[type="application/ld+json"]'
          );
          const contextString = scriptElement
            ? scriptElement.textContent
            : null;
          contextData = JSON.parse(String(contextString));
        }

        const initialData = JSON.parse(event.data.text);

        window._initialData = initialData;

        if (message) {
          chrome.runtime.sendMessage({
            message: "initialDataSet",
            initialData: initialData,
            process: message.process,
            context: contextData,
          });
        }

        resolve(window._initialData);
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
  });
}

async function getInitialData(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  console.log("scraper script received message");

  if (message.message == "getInitialData") {
    console.log("Starting scraping!");

    if (message.getContext) {
      await Promise.race([
        //either external link or apply button
        waitForElement("#indeedApplyButton", true),
        waitForElement("#applyButtonLinkContainer", true),
      ]);
    }

    getInitialDataInjection(message);
  }
}
