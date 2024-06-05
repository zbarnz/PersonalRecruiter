import {
  waitForURL,
  waitForElement,
  shortWait,
} from "../../../lib/utils/waits";

function generateUniqueNavId(): string {
  const currentTime = new Date().getTime(); // Current time in milliseconds
  const randomComponent = Math.random().toString(36).substring(2, 15); // A random string
  const navId = `nav-${currentTime}-${randomComponent}`;
  return navId;
}

const SITE_NAME = "Indeed";

console.log("loading FINAL " + Date.now() / 1000);

/*
The below listeners are added in the order they are 
exected to be triggered
*/

chrome.runtime.onMessage.addListener(newTabListener);
chrome.runtime.onMessage.addListener(checkSignedInListener);

async function newTabListener(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  if (message.message == "newTab") {
    console.log("received new tab message");
    await waitForURL(`^https:\/\/www\.indeed\.com\/.*`, 10000);
    const element = await waitForElement(".gnav", true);
    await shortWait();

    if (element == "cloudflare") {
      const cloudflareMessage = {
        message: "cloudFlareDetected",
      };

      console.log("cloudflare Detected");
      chrome.runtime.sendMessage(cloudflareMessage);
      return;
    }

    const completeMessage = {
      message: "newTabComplete",
    };

    console.log("sending newtab complete message");
    console.log(completeMessage);
    await chrome.runtime.sendMessage(completeMessage);
  }
  // Optionally send a response
  sendResponse({ status: "Received" });
  return true;
}

async function checkSignedInListener(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) {
  console.log(message);
  let tabId = message.tabId;

  function checkSignedIn() {
    console.log("Checking if signed in");

    const signInButtonSelector = 'div[data-gnav-element-name="SignIn"] a';
    const navSelector = ".gnav";

    const signInButton = document.querySelector(signInButtonSelector);

    console.log(signInButton);

    if (signInButton) {
      return false;
    } else {
      return true;
    }
  }

  let isSignedIn = checkSignedIn();

  if (message.message == "checkSignedIn") {
    if (isSignedIn) {
      console.log("Already signed in");
      chrome.runtime.sendMessage({ action: "newListingScrape" });
    } else {
      await signIn(tabId).catch(console.error);
    }
  }
  if (message.message == "checkSignedInFinal") {
    if (isSignedIn) {
      console.log("Succesfully signed in");
      chrome.runtime.onMessage.removeListener(checkSignedInListener);
      chrome.runtime.sendMessage({ action: "newListingScrape" });
    } else {
      console.error("User still not signed in");
      chrome.runtime.onMessage.removeListener(checkSignedInListener);
    }
  }

  sendResponse({ status: "Received" });
}

async function signIn(tabId: number) {
  try {
    chrome.runtime.sendMessage({
      action: "showNotification",
      message: `Please Sign in to ${SITE_NAME}`,
      title: "Action Needed",
    });

    chrome.runtime.sendMessage({ message: "startListeningForSignIn" }, () => {
      window.location.href = "https://secure.indeed.com/auth";
    });
  } catch (err) {
    console.log(err);
  }
}

// async function listeningForSignInListener(
//   message: any,
//   sender: chrome.runtime.MessageSender,
//   sendResponse: (response: any) => void
// ) {
//   if (message.message == "listeningForSignIn") {
//     window.location.href = "https://secure.indeed.com/auth";
//   }
// }
