import { getRandomInt } from "./math.ts";

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

export async function waitForElement(selector: string, timeout = 30000): Promise<Element | null> {
  return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
          const el = document.querySelector(selector);
          if (el) {
              resolve(el);
          } else if (Date.now() - startTime > timeout) {
              reject(new Error(`Timeout waiting for ${selector}`));
          } else {
              setTimeout(check, 100); // check every 100ms
          }
      };

      check();
  });
}