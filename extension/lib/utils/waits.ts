import { getRandomInt } from "./math";

/**
 * Performs a short, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 2 to 5 seconds.
 */
export async function shortWait() {
  return new Promise((resolve) =>
    setTimeout(resolve, getRandomInt(2000, 5000))
  );
}

/**
 * Performs a tiny, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 0.5 to 1.5 seconds.
 */
export async function tinyWait() {
  return new Promise((resolve) => setTimeout(resolve, getRandomInt(500, 1500)));
}

/**
 * Performs a medium, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 5 to 10 seconds.
 */
export async function mediumWait() {
  return new Promise((resolve) =>
    setTimeout(resolve, getRandomInt(5000, 10000))
  );
}

/**
 * Performs a medium, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 7 to 15 seconds.
 */
export async function longWait() {
  return new Promise((resolve) =>
    setTimeout(resolve, getRandomInt(7000, 15000))
  );
}

export async function waitForElement(
  selector: string,
  checkCloudflare: boolean,
  timeout = 30000
): Promise<Element | null | "cloudflare"> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      let cfEl;
      const el = document.querySelector(selector);

      if (checkCloudflare) {
        cfEl = document.querySelector("#challenge-stage");
      }

      if (el) {
        resolve(el);
      } else if (cfEl) {
        resolve("cloudflare");
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for ${selector}`));
      } else {
        setTimeout(check, 200); // check every 100ms
      }
    };
    console.log("checking element...");
    check();
  });
}

export async function waitForNavigationComplete(
  timeout: number = 30000
): Promise<void> {
  console.log("in navigation wait");
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Navigation timeout"));
    }, timeout);

    chrome.runtime.onMessage.addListener(function listener(request: {
      action: string;
    }) {
      console.log("navigation wait listener triggereqd");
      if (request.action === "navigateComplete") {
        clearTimeout(timeoutId);
        chrome.runtime.onMessage.removeListener(listener);
        resolve();
      }
    });
  });
}

// Define a function to wait for the URL to change to the expected URL
export function waitForURL(
  expectedPattern: string | RegExp,
  timeout: number = 600000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const regex =
      typeof expectedPattern === "string"
        ? new RegExp(expectedPattern)
        : expectedPattern;

    const checkUrl = () => {
      console.log("checking url");
      console.log(regex);

      if (regex.test(window.location.href)) {
        console.log("resolved");
        resolve();
      } else if (Date.now() - startTime > timeout) {
        console.log("rejected");
        reject(
          new Error(
            `Timeout reached waiting for URL pattern: ${expectedPattern}`
          )
        );
      } else {
        console.log("try again");
        setTimeout(checkUrl, 100); // Check every 100ms
      }
    };

    checkUrl();
  });
}
