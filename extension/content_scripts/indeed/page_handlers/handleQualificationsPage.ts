
//Click "Yes" as in "yes I am qualified" for every question on qualifications page
//TODO some users may not want every answer answered as yes??

export async function handleQualificationsPage() {
  // Find all input elements with the value "Yes" and click them
  const yesButtons = document.querySelectorAll('input[value="Yes"]');

  for (const button of yesButtons) {
    // Type assertion to HTMLElement to use the click method
    if (button instanceof HTMLElement) {
      button.click();
    }
  }

  // Since we don't have a Page object, we just ensure the function has completed
  // Any further actions or checks should be done after calling this function
}