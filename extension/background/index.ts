

async function getActiveTabId(): Promise<number> {
  let keyPropPair = await chrome.storage.local.get(["activeTabId"]);

  return keyPropPair.activeTabId;
}
chrome.runtime.onSuspend.addListener(() => console.log("SUSPENDING"));

/******************* *
 * Naviagtion listner
 **********************/

chrome.runtime.onMessage.addListener(
  (
    message: { action: string; url?: string; tabId?: number; navId: string },
    sender,
    sendResponse
  ) => {
    if (message.action === "navigate" && message.url) {
      if (message.navId) {
        const activeTab = sender.tab?.id;
        if (typeof activeTab == "number") {
          const navigateListener = (tabId: number, changeInfo: any) => {
            console.log(changeInfo);
            if (changeInfo.status === "complete") {
              console.log("sending response");
              chrome.tabs.sendMessage(activeTab, "navigationComplete");
              console.log("response sent");
              chrome.tabs.onUpdated.removeListener(navigateListener); // Cleanup listener
            }
          };

          // Register listener before initiating navigation to avoid missing the event
          chrome.tabs.onUpdated.addListener(navigateListener);

          chrome.tabs.update(activeTab, { url: message.url }, (tab) => {
            console.log("Updating tab...");
            // If the tab cannot be updated or the URL is loaded instantly, consider additional handling
            if (chrome.runtime.lastError || !tab) {
              console.error("Navigation failed or tab was closed.");
              chrome.tabs.onUpdated.removeListener(navigateListener); // Cleanup listener if necessary
            }
          });
        } else {
          console.error("error getting sender tab ID");
        }
      } else {
        console.error("No NavId received.");
      }
    }
  }
);

/******************* *
 * New Tab listners
 **********************/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setup") {
    console.log("received setup message");
    chrome.tabs.create({ url: message.url }, (newTab) => {
      if (newTab.id !== undefined) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === "complete") {
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                files: ["./webpack_build/setup.js"], //TODO fix path relative to directory root
              },
              () => {
                // Handle injection result
                if (chrome.runtime.lastError) {
                  console.error(
                    `Error injecting script: ${chrome.runtime.lastError.message}`
                  );
                } else {
                  // Send message to the content script in the newly created tab
                  // We cant send a response because the original Promise was
                  // in the popup
                  console.log("sending new tab message");
                  chrome.tabs.sendMessage(tabId, { message: "newTab" });
                }
              }
            );
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      }
    });
  }
});

//cloudflare listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "cloudFlareDetected") {
    console.log("waiting for cloudflare");

    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("src/images/icon128.png"), // Path to the icon
      title: "Attention Required",
      message: "Captcha Validation Required on Page", // Message received from content script
    });

    if (message.process == "setup") {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (
          tabId === sender.tab?.id &&
          changeInfo.status === "complete" &&
          changeInfo.title?.includes("Indeed".toLocaleLowerCase()) //sorry
        ) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabId },
              files: ["./webpack_build/setup.js"], //TODO fix path relative to directory root
            },
            () => {
              // Handle injection result
              if (chrome.runtime.lastError) {
                console.error(
                  `Error injecting script: ${chrome.runtime.lastError.message}`
                );
              } else {
                // Send message to the content script in the newly created tab
                // We cant send a response because the original Promise was
                // in the popup
                console.log("sending new tab message");
                chrome.tabs.sendMessage(tabId, { message: "newTab" });
              }
            }
          );
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    }
  }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.message === "newTabComplete") {
    console.log("received New Tab Complete Message");
    const tab = sender.tab?.id;
    console.log("got tab: " + tab);
    if (typeof tab == "number") {
      chrome.tabs.sendMessage(tab, { message: "checkSignedIn" });
    }
  }
});

/******************* *
 * Sign in listners
 **********************/

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "startListeningForSignIn") {
    console.log("before async");

    console.log("Listening for Signin");
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (
        tabId == sender.tab?.id &&
        tab.url &&
        !tab.url.includes("auth") &&
        tabId &&
        changeInfo.status === "complete"
      ) {
        console.log(`URL changed to: ${tab.url}`);
        // Perform your actions here, e.g., check if the URL matches a specific pattern
        if (tab.url.includes("indeed.com")) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabId },
              files: ["./webpack_build/setup.js"], //TODO fix path relative to directory root
            },
            () => {
              chrome.tabs.sendMessage(tabId, {
                message: "checkSignedInFinal",
              });
            }
          );
          console.log("Sending re check sign in to content script");
        } else {
          console.error("Extension failed: User left indeed");
        }
      }
    });

    chrome.tabs.sendMessage(sender.tab?.id!, "listeningForSignIn");
    //return true;
  }
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action === "showNotification") {
    // Show the notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("src/images/icon128.png"), // Path to the icon
      title: msg.title,
      message: msg.message, // Message received from content script
    });
  }
});

/************************************
 *
 *  Collect Listings
 *
 ************************************/

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.action === "scrapePage") {
    if (msg.page) {

    }
  }
});
