import { LISTING_LIMIT_PER_PAGE } from "../../env.json";

const button = document.getElementById("activateButton") as HTMLElement;
const jobQueryInput = document.getElementById(
  "searchQueryInput"
) as HTMLInputElement;

const limit = LISTING_LIMIT_PER_PAGE

//unset error
jobQueryInput.addEventListener("click", () => {
  jobQueryInput.style.borderColor = "#6c5ce7";
  jobQueryInput.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
});

button.addEventListener("click", () => {
  if (!jobQueryInput.value) {
    // Apply red border and box shadow directly
    jobQueryInput.style.borderColor = "#ff6b6b";
    jobQueryInput.style.boxShadow = "0 0 5px #ff6b6b";

    // Keyframes for bouncing effect cannot be applied inline, using an alternative approach
    jobQueryInput.animate(
      [
        // Keyframes
        { transform: "translateY(0)" },
        { transform: "translateY(-5px)" },
        { transform: "translateY(0)" },
      ],
      {
        // Timing options
        duration: 200,
        iterations: 1,
      }
    );

    return;
  }

  // Send a message to the background script
  chrome.runtime.sendMessage({
    action: "setup",
    url: `https://www.indeed.com/jobs?q=${jobQueryInput.value}&limit=${limit}`,
  });
});
