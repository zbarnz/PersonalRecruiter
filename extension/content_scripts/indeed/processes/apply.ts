import { mediumWait, shortWait } from "../../../lib/utils/waits";

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
    while (true) {
      console.log("still alive :)");

      await shortWait();
    }
  }
}
