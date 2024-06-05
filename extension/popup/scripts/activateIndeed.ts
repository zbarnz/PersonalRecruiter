const button = document.getElementById("activateButton") as HTMLElement;
const jobQueryInput = document.getElementById(
  "searchQueryInput"
) as HTMLInputElement;
const userId = document.getElementById("userIdInput") as HTMLInputElement;

const limit = 50;

//unset error
jobQueryInput.addEventListener("click", () => {
  jobQueryInput.style.borderColor = "#6c5ce7";
  jobQueryInput.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.1)";
});

button.addEventListener("click", async () => {
  const apiUrl = "http://localhost:4000/api";
  const jobBoardName = "Indeed";

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

  // Create promises for both fetch requests
  const jobBoardPromise = fetch(`${apiUrl}/jobBoard/${jobBoardName}`, {
    method: "GET",
  }).then((response) => response.json());

  const userPromise = fetch(`${apiUrl}/user/${userId.value}`, {
    method: "GET",
  }).then((response) => response.json());

  const configPromise = fetch(`${apiUrl}/uconfig/${userId.value}`, {
    method: "GET",
  }).then((response) => response.json());

  Promise.all([jobBoardPromise, userPromise, configPromise])
    .then(([jobBoardData, userData, configData]) => {
      if (jobBoardData.error || userData.error || configData.error) {
        let errorMessage = "";
        if (jobBoardData.error) errorMessage += jobBoardData.error;
        if (userData.error) errorMessage += " " + userData.error;
        if (configData.error) errorMessage += " " + configData.error;
        throw new Error(errorMessage);
      }

      chrome.storage.local
        .set({
          jobQuery: jobQueryInput.value,
          jobBoard: jobBoardData,
          user: userData,
          config: configData,
        })
        .then(() => {
          chrome.runtime.sendMessage({
            action: "setup",
            url: `https://www.indeed.com/jobs?q=${jobQueryInput.value}`,
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
