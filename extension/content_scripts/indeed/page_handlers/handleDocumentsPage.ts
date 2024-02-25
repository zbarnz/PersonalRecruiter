async function handleDocumentsPage(clText) {
  const fileInputElement = document.querySelector('input[type="file"]');

  if (fileInputElement instanceof HTMLElement) { // This check ensures fileInputElement is an HTMLElement
    console.log("Inputting cover letter file");
    // Make the file input visible
    fileInputElement.style.display = "block"; // Adjust as needed to make the input visible

    // Trigger click to open the file dialog - users will have to select the file manually
    fileInputElement.click();
  } 
  // Handle the case where the file input element is not found
  // and try to populate the cover letter text input instead
  else if (!fileInputElement) {
    console.log("Populating cover letter text input");
    const coverLetterButton = document.querySelector("#write-cover-letter-selection-card");
    if (coverLetterButton instanceof HTMLElement) { // Ensure coverLetterButton is an HTMLElement
      coverLetterButton.click();
    }

    // Fill out the cover letter section
    const textArea = document.querySelector('textarea[name="coverletter-textarea"]');
    if (textArea instanceof HTMLTextAreaElement) { // Ensure textArea is specifically an HTMLTextAreaElement
      textArea.value = clText;
      // Dispatch an 'input' event to ensure any JavaScript listening for this updates appropriately
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } 
}
