/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./build/lib/utils/math.js":
/*!*********************************!*\
  !*** ./build/lib/utils/math.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateYearlySalary: () => (/* binding */ calculateYearlySalary),
/* harmony export */   getRandomInt: () => (/* binding */ getRandomInt)
/* harmony export */ });
function calculateYearlySalary(frequency, amount) {
    switch (frequency.toLowerCase()) {
        case "annual": //dice
        case "year": //indeed
            return amount;
        case "monthly": //dice
        case "month": //indeed
            return amount * 12;
        case "hourly": //dice
        case "hour": //indeed
            // Assuming a 40-hour work week and 52 weeks in a year
            return amount * 40 * 52;
        default:
            return 1337;
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
//# sourceMappingURL=math.js.map

/***/ }),

/***/ "./build/lib/utils/waits.js":
/*!**********************************!*\
  !*** ./build/lib/utils/waits.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   longWait: () => (/* binding */ longWait),
/* harmony export */   mediumWait: () => (/* binding */ mediumWait),
/* harmony export */   shortWait: () => (/* binding */ shortWait),
/* harmony export */   tinyWait: () => (/* binding */ tinyWait),
/* harmony export */   waitForElement: () => (/* binding */ waitForElement),
/* harmony export */   waitForNavigationComplete: () => (/* binding */ waitForNavigationComplete),
/* harmony export */   waitForURL: () => (/* binding */ waitForURL)
/* harmony export */ });
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math */ "./build/lib/utils/math.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
 * Performs a short, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 2 to 5 seconds.
 */
function shortWait() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, (0,_math__WEBPACK_IMPORTED_MODULE_0__.getRandomInt)(2000, 5000)));
    });
}
/**
 * Performs a tiny, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 0.5 to 1.5 seconds.
 */
function tinyWait() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, (0,_math__WEBPACK_IMPORTED_MODULE_0__.getRandomInt)(500, 1500)));
    });
}
/**
 * Performs a medium, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 5 to 10 seconds.
 */
function mediumWait() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, (0,_math__WEBPACK_IMPORTED_MODULE_0__.getRandomInt)(5000, 10000)));
    });
}
/**
 * Performs a medium, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 7 to 15 seconds.
 */
function longWait() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, (0,_math__WEBPACK_IMPORTED_MODULE_0__.getRandomInt)(7000, 15000)));
    });
}
function waitForElement(selector, checkCloudflare, timeout = 30000) {
    return __awaiter(this, void 0, void 0, function* () {
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
                }
                else if (cfEl) {
                    resolve("cloudflare");
                }
                else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for ${selector}`));
                }
                else {
                    setTimeout(check, 200); // check every 100ms
                }
            };
            console.log("checking element...");
            check();
        });
    });
}
function waitForNavigationComplete(timeout = 30000) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("in navigation wait");
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error("Navigation timeout"));
            }, timeout);
            chrome.runtime.onMessage.addListener(function listener(request) {
                console.log("navigation wait listener triggereqd");
                if (request.action === "navigateComplete") {
                    clearTimeout(timeoutId);
                    chrome.runtime.onMessage.removeListener(listener);
                    resolve();
                }
            });
        });
    });
}
// Define a function to wait for the URL to change to the expected URL
function waitForURL(expectedPattern, timeout = 600000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const regex = typeof expectedPattern === "string"
            ? new RegExp(expectedPattern)
            : expectedPattern;
        const checkUrl = () => {
            console.log("checking url");
            console.log(regex);
            if (regex.test(window.location.href)) {
                console.log("resolved");
                resolve();
            }
            else if (Date.now() - startTime > timeout) {
                console.log("rejected");
                reject(new Error(`Timeout reached waiting for URL pattern: ${expectedPattern}`));
            }
            else {
                console.log("try again");
                setTimeout(checkUrl, 100); // Check every 100ms
            }
        };
        checkUrl();
    });
}
//# sourceMappingURL=waits.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************************************!*\
  !*** ./build/content_scripts/indeed/processes/setup.js ***!
  \*********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_utils_waits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/utils/waits */ "./build/lib/utils/waits.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function generateUniqueNavId() {
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
function newTabListener(message, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.message == "newTab") {
            console.log("received new tab message");
            yield (0,_lib_utils_waits__WEBPACK_IMPORTED_MODULE_0__.waitForURL)(`^https:\/\/www\.indeed\.com\/.*`, 10000);
            const element = yield (0,_lib_utils_waits__WEBPACK_IMPORTED_MODULE_0__.waitForElement)(".gnav", true);
            yield (0,_lib_utils_waits__WEBPACK_IMPORTED_MODULE_0__.shortWait)();
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
            yield chrome.runtime.sendMessage(completeMessage);
        }
        // Optionally send a response
        sendResponse({ status: "Received" });
    });
}
function checkSignedInListener(message, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
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
            }
            else {
                return true;
            }
        }
        let isSignedIn = checkSignedIn();
        if (message.message == "checkSignedIn") {
            if (isSignedIn) {
                console.log("Already signed in");
            }
            else {
                yield signIn(tabId).catch(console.error);
            }
        }
        if (message.message == "checkSignedInFinal") {
            if (isSignedIn) {
                console.log("Succesfully signed in");
                window.location.href = "www.indeed.com";
            }
            else {
                console.error("User still not signed in");
                chrome.runtime.onMessage.removeListener(checkSignedInListener);
            }
        }
        // Optionally send a response
        sendResponse({ status: "Received" });
    });
}
function signIn(tabId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            chrome.runtime.sendMessage({
                action: "showNotification",
                message: `Please Sign in to ${SITE_NAME}`,
                title: "Action Needed",
            });
            chrome.runtime.sendMessage({ message: "startListeningForSignIn" }, () => {
                window.location.href = "https://secure.indeed.com/auth";
            });
        }
        catch (err) {
            console.log(err);
        }
    });
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
//# sourceMappingURL=setup.js.map
})();

/******/ })()
;
//# sourceMappingURL=setup.js.map