async function handleWorkExperiencePage(jobTitle: string, companyName: string) {
  // Find the job title input with the id "jobTitle" and set its value
  const jobTitleInput = document.querySelector("#jobTitle");
  if (jobTitleInput && jobTitleInput instanceof HTMLInputElement) {
    jobTitleInput.value = jobTitle;
    jobTitleInput.dispatchEvent(new Event("input", { bubbles: true })); // To trigger any bound event listeners
  }

  // Find the company input with the id "companyName" and set its value
  const companyNameInput = document.querySelector("#companyName");
  if (companyNameInput && companyNameInput instanceof HTMLInputElement) {
    companyNameInput.value = companyName;
    companyNameInput.dispatchEvent(new Event("input", { bubbles: true })); // To trigger any bound event listeners
  }
}
