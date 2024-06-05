import { calculateYearlySalary, safeMath } from "../../lib/utils/math";
import { shortWait } from "../../lib/utils/waits";

import { readLocalStorage } from "../../lib/utils/chrome/storage";

import { AutoApply, JobBoard, Listing, User } from "../../src/entity";

type JobDetails = {
  jobKey: any;
  showExperienceFlag: boolean;
  requiredQualifications: any;
  listing: Listing;
  questionsUrl: string;
};

//testing stuff
//TODO track these values in environment somehow
const apiUrl = "http://localhost:4000/api";
//

let INDEED_BOARD: JobBoard;
let CURRENT_USER: User;
let REQUESTED_LISTINGS: number;

let prevListingsPerPage: number; //Not sure if this changes between user so just track it individually

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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "setup") {
    console.log("received setup message");
    INDEED_BOARD = await readLocalStorage("jobBoard");
    REQUESTED_LISTINGS = await readLocalStorage("requestedListings");
    CURRENT_USER = await readLocalStorage("user");

    console.log("current user: \n" + JSON.stringify(CURRENT_USER));
    console.log("Job Board: \n" + JSON.stringify(INDEED_BOARD));

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

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      console.log(changeInfo);
      console.log(tabId);
      if (
        tabId === sender.tab?.id &&
        changeInfo.title?.toLocaleLowerCase().includes("indeed") //sorry
      ) {
        console.log("cloudflare Complete message triggered");
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
              console.log("running cloudflare update listener send message");
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.message === "newTabComplete") {
    console.log("received New Tab Complete Message");

    //clear storage
    chrome.storage.local.remove(["pagesCrawled", "unappliedListings"]);

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

chrome.runtime.onMessage.addListener(newListingScrapeListener);
chrome.runtime.onMessage.addListener(parseListings);

async function newListingScrapeListener(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (msg.action === "newListingScrape") {
    await newListingScrape(msg, sender);
  }
  return true; // Keeps the message channel open if you are going to respond asynchronously
}

async function newListingScrape(
  msg: any,
  sender: chrome.runtime.MessageSender
) {
  console.log("New Listing Scrape Message Received");
  const jobQuery = await readLocalStorage("jobQuery");
  const pagesCrawled = (await readLocalStorage("pagesCrawled")) || 0;

  if (sender.tab && sender.tab.id) {
    const tabId: number = msg.prevTab || sender.tab.id;
    console.log("tabId: " + tabId);
    console.log("senderTabId: " + sender.tab.id);

    chrome.tabs.onUpdated.addListener(function listener(
      tabIdUpdated: number,
      changeInfo: any
    ) {
      if (tabIdUpdated === tabIdUpdated && changeInfo.status === "complete") {
        // Remove listener to avoid unwanted additional triggers
        chrome.tabs.onUpdated.removeListener(listener);

        // Execute the script after the tab is fully loaded
        chrome.scripting.executeScript(
          {
            target: { tabId: tabIdUpdated },
            files: ["./webpack_build/getInitialData.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                `Error injecting script: ${chrome.runtime.lastError.message}`
              );
            } else {
              chrome.tabs.sendMessage(tabIdUpdated, {
                message: "getInitialData",
                process: "scrapeListings",
              });
            }
          }
        );
      }
    });

    await chrome.tabs.update(tabId, {
      url: `https://www.indeed.com/jobs?q=${jobQuery}&start=${
        prevListingsPerPage * (pagesCrawled + 1)
      }`,
    });
  } else {
    throw new Error("error getting tabId");
  }
}

async function parseListings(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (msg.message === "initialDataSet" && msg.process == "scrapeListings") {
    try {
      console.log("Removing applied listings...");

      const jobKeys = Object.keys(
        msg.initialData.jobKeysWithTwoPaneEligibility
      );

      prevListingsPerPage = jobKeys.length;

      console.log(jobKeys);

      const res = await fetch(`${apiUrl}/autoApply/removeAppliedListings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobKeys,
          user: CURRENT_USER,
          jobBoard: INDEED_BOARD,
        }),
      });

      if (res.status !== 200) {
        throw new Error(
          "Removing applied listings failed: " +
            JSON.stringify(await res.json())
        );
      }

      const newListingIds = await res.json();
      let updatedListings: string[] = [];

      const existingListings: string[] =
        (await readLocalStorage("unappliedListings")) || [];

      updatedListings = [...new Set([...existingListings, ...newListingIds])];

      chrome.storage.local.set({ unappliedListings: updatedListings });

      //set pages crawled
      //using local stroage for syncronous nature
      const pagesCrawled: number =
        (await readLocalStorage("pagesCrawled")) || 0;

      chrome.storage.local.set({ pagesCrawled: pagesCrawled + 1 });

      console.log(
        "Scraped " +
          updatedListings.length +
          " listings on " +
          pagesCrawled +
          " pages."
      );

      chrome.storage.local.get(console.log);

      await shortWait();

      if (updatedListings.length < REQUESTED_LISTINGS) {
        console.log("Sending " + pagesCrawled + "th page crawl request");
        await newListingScrape(msg, sender);
      } else {
        console.log("Getting Listing Data...");
        await getListingData(msg, sender);
      }
    } catch (err) {
      console.log("Error in keyParser: " + err);
    }
    return true; // Keeps the message channel open if you are going to respond asynchronously
  }
}

/**********************
 *
 *   Parse Job Data
 *
 **********************/

chrome.runtime.onMessage.addListener(getListingDataListner);
chrome.runtime.onMessage.addListener(parseListingDataListener);

async function getListingDataListner(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (msg.action === "getListingData") {
    await getListingData(msg, sender);
  }
  return true; // Keeps the message channel open if you are going to respond asynchronously
}

async function getListingData(msg: any, sender: chrome.runtime.MessageSender) {
  try {
    const listings: string[] =
      (await readLocalStorage("unappliedListings")) || [];

    const listingToApply = listings[0]; //"4ebba763f669f999"; //TESTING TESTING TESTING

    console.log("Getting Data for " + listingToApply);

    if (listingToApply && sender.tab?.id) {
      chrome.tabs.onUpdated.addListener(getListingDataUpdateListner);

      chrome.tabs.update(sender.tab.id, {
        url: `https://www.indeed.com/viewjob?jk=${listingToApply}`,
      });
    }

    async function getListingDataUpdateListner(tabId: number, changeInfo: any) {
      if (tabId === sender.tab?.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(getListingDataUpdateListner);
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ["./webpack_build/getInitialData.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                `Error injecting script: ${chrome.runtime.lastError.message}`
              );
            } else {
              chrome.tabs.sendMessage(tabId, {
                message: "getInitialData",
                process: "getListingData",
                getContext: true,
              });
            }
          }
        );
      }
    }
  } catch {
    throw new Error("error getting tabId");
  }
}

async function parseListingDataListener(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (msg.message === "initialDataSet" && msg.process == "getListingData") {
    if (sender.tab?.id) {
      const initialData: any = msg.initialData;
      const contextData: any = msg.context;
      const applyButtonAttributes: IndeedApplyButtonAttributes =
        initialData?.indeedApplyButtonContainer?.indeedApplyButtonAttributes;
      const isDisabled: boolean =
        initialData?.indeedApplyButtonContainer?.disabled;

      let showExperienceFlag: boolean;

      console.log(contextData);
      console.log(initialData);

      let maxYearlySalary: number;
      let minYearlySalary: number;

      if (
        contextData.baseSalary?.value?.maxValue ||
        contextData.baseSalary?.value?.value
      ) {
        maxYearlySalary = calculateYearlySalary(
          contextData.baseSalary.value.unitText || "Year",
          contextData.baseSalary?.value?.maxValue ||
            contextData.baseSalary?.value?.value
        );
      } else if (
        contextData.baseSalary?.value?.minValue ||
        contextData.baseSalary?.value?.value
      ) {
        minYearlySalary = calculateYearlySalary(
          contextData.baseSalary.value.unitText || "Year",
          contextData.baseSalary?.value?.minValue ||
            contextData.baseSalary?.value?.value
        );
      } else {
        maxYearlySalary = 1337;
        minYearlySalary = 1337;
      }

      const listing = new Listing();

      listing.title = contextData.title;
      listing.description = contextData.description;
      listing.company = contextData.hiringOrganization.name;
      listing.datePosted = new Date(Date.now());
      listing.employmentType = contextData.employmentType ?? null;
      listing.currency = contextData.baseSalary?.currency ?? null;
      listing.minSalary = safeMath(Math.floor, minYearlySalary!) ?? null;
      listing.maxSalary = safeMath(Math.ceil, maxYearlySalary!) ?? null;
      listing.country =
        contextData.jobLocation?.address?.addressCountry ?? null;
      listing.region1 =
        contextData.jobLocation?.address?.addressRegion1 ?? null;
      listing.region2 =
        contextData.jobLocation?.address?.addressRegion2 ?? null;
      listing.locality =
        contextData.jobLocation?.address?.addressLocality ?? null;
      listing.remoteFlag = contextData.jobLocationType == "TELECOMMUTE"; //if telecommute then true
      listing.jobBoard = INDEED_BOARD;
      listing.jobListingId = initialData.jobKey;
      listing.requirementsObject =
        initialData.jobInfoWrapperModel?.jobInfoWrapperModel
          ?.jobDescriptionSectionModel?.qualificationsSectionModel?.content ??
        null;
      listing.salaryObject = contextData.baseSalary ?? null;
      listing.oragnizationObject = contextData.hiringOrganization ?? null;
      listing.locationObject = contextData.jobLocation ?? null;
      listing.directApplyFlag = contextData.directApply;
      listing.questionsFlag =
        applyButtonAttributes?.questions || initialData.hr?.questions
          ? true
          : false;

      const res = await fetch(`${apiUrl}/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing,
        }),
      });

      if (res.status !== 200) {
        throw new Error(
          "Failed to create listing: " + JSON.stringify(await res.json())
        );
      }

      const createdListing = await res.json();
      console.log(createdListing);

      if (isDisabled) {
        console.log("creating Exception for Job (apply button disabled)");
        const res = await fetch(`${apiUrl}/exception/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: CURRENT_USER.id,
            jobBoard: INDEED_BOARD,
            reason: "Disabled Apply Button",
            listingId: initialData.jobKey,
          }),
        });

        if (res.status != 200) {
          console.log("failed to create exception");
          console.log(res);
          console.log(await res.json());
          return;
        }

        const listings: string[] =
          (await readLocalStorage("unappliedListings")) || [];

        await chrome.storage.local.set({
          unappliedListings: listings.filter(
            (item) => item !== initialData.jobKey
          ),
        });

        await shortWait();
        await getListingData(msg, sender);
        return;
      }

      if (!contextData.directApply) {
        //Create an exception for this user
        console.log("creating Exception for Job (not direct apply)");

        const res = await fetch(`${apiUrl}/exception/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: CURRENT_USER.id,
            jobBoard: INDEED_BOARD,
            reason: "Extenal Apply Link",
            listingId: initialData.jobKey,
          }),
        });

        if (res.status != 200) {
          console.log("failed to create exception");
          console.log(res);
          console.log(await res.json());
          return;
        }

        const listings: string[] =
          (await readLocalStorage("unappliedListings")) || [];

        await chrome.storage.local.set({
          unappliedListings: listings.filter(
            (item) => item !== initialData.jobKey
          ),
        });

        await shortWait();
        await getListingData(msg, sender);
        return;
      }

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
        initialData.jobInfoWrapperModel.jobInfoModel.jobDescriptionSectionModel
          ?.qualificationsSectionModel?.content || null;

      const questionsUrl = applyButtonAttributes?.questions;

      const jobDetails: JobDetails = {
        jobKey: initialData.jobKey,
        listing: createdListing,
        showExperienceFlag: showExperienceFlag,
        requiredQualifications: requiredQualifications,
        questionsUrl: questionsUrl,
      };

      chrome.storage.local.set({
        currentListingContext: jobDetails,
      });

      await shortWait();

      console.log("sending start apply messsage...");

      //set apply listener and send message
      chrome.scripting.executeScript(
        {
          target: { tabId: sender.tab?.id },
          files: ["./webpack_build/apply.js"],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              `Error injecting script: ${chrome.runtime.lastError.message}`
            );
          } else {
            chrome.tabs.onUpdated.addListener(applyPageReachedListener);
            chrome.tabs.sendMessage(sender.tab?.id!, { action: "startApply" }); //tabId is definitly freaking defined
          }
        }
      );
    } else {
      throw new Error("Failed to get tab id");
    }
  }
}

/**********************
 *
 *       Apply
 *
 **********************/

async function applyPageReachedListener(tabId: number, changeInfo: any) {
  console.log("1" + changeInfo);
  if (
    changeInfo.status === "loading" &&
    changeInfo.url &&
    (changeInfo.url.includes("m5.apply.indeed") ||
      changeInfo.url.includes("smartapply.indeed"))
  ) {
    if (changeInfo.url.includes("/verify-account")) {
      throw new Error("Must verify account");
    }
    console.log("Arrived at apply page");
    chrome.tabs.onUpdated.removeListener(applyPageReachedListener);
    chrome.tabs.onUpdated.addListener(startApplyListner);
  }
}

async function startApplyListner(tabId: number, changeInfo: any) {
  console.log("2" + changeInfo);
  if (changeInfo.status === "complete") {
    chrome.tabs.onUpdated.removeListener(startApplyListner);

    console.log("Beginning Apply flow...");
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["./webpack_build/apply.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            `Error injecting script: ${chrome.runtime.lastError.message}`
          );
        } else {
          chrome.tabs.sendMessage(tabId, {
            action: "beginApplyFlow",
          });
        }
      }
    );
  }
}

async function applyCompleteListner(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  if (msg.message === "applyComplete") {
    console.log("Completed Apply!");
    if (msg.autoApply) {
      const autoApply: AutoApply = msg.autoApply;
      const res = await fetch(`${apiUrl}/autoApply/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoApply: autoApply.id,
        }),
      });

      if (res.status != 200) {
        throw new Error(
          "Failed to complete autoApply: " + JSON.stringify(await res.json())
        );
      }
    } else {
      throw new Error("Apply completed but could not get auto apply record...");
    }
  }
}
