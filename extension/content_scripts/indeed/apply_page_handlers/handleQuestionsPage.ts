export async function handleQuestionsPage(answeredQuestions: any) {
  let indeedStandardQuestions: any;

  if ("viewId" in answeredQuestions[0]) {
    indeedStandardQuestions = true;
  } else {
    indeedStandardQuestions = false;
  }

  // Wait for questions to be visible; in a content script, this might be simplified to a delay or checking the existence of elements
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simplified wait

  // Add 'answered' property when it doesn't exist
  answeredQuestions.forEach((question: any) => {
    if (typeof question.answered === "undefined") {
      question.answered = false;
    }
  });

  for (let i = 0; i < answeredQuestions.length; i++) {
    await fillQuestion(answeredQuestions[i]);
  }
}

export async function fillQuestion(question: any) {
  if (question.answered) {
    console.log(
      "skipping answered question: " + question.viewId || question.name
    );
    return;
  }

  const elementIdSelectorId = `[id*="${question.viewId}"]`;
  const elementIdSelectorName = `[id*="${question.name}"]`;
  const elementNameSelectorId = `[name*="${question.viewId}"]`;
  const elementNameSelectorName = `[name*="${question.name}"]`;

  let elementsById = document.querySelectorAll(elementIdSelectorId);
  let elementsByName = document.querySelectorAll(elementIdSelectorName);
  let elementArr = elementsByName.length ? elementsByName : elementsById;

  const validElementTags = ["input", "textarea", "select"];
  let filteredElements = Array.from(elementArr).filter((el) => {
    const tagName = el.tagName.toLowerCase();
    const containsFieldset =
      tagName === "div" && el.querySelector("fieldset") !== null;
    return containsFieldset || validElementTags.includes(tagName);
  });

  filteredElements;

  if (!filteredElements.length) {
    console.log(
      `No input found for question ` + question.viewId || question.name
    );
    return;
  }

  // Handle multi-input questions (e.g., checkboxes)
  if (filteredElements.length > 1) {
    let correctInput = Array.from(filteredElements).find((el) => {
      const element = el as HTMLInputElement;

      const inputValue = element.value;
      const nextSibling = el.nextElementSibling;
      const spanInnerHTML = nextSibling ? nextSibling.innerHTML : "";
      return (
        inputValue === question.answer || spanInnerHTML === question.answer
      );
    });

    if (correctInput) {
      filteredElements = [correctInput];
      console.log("Filtered element array to include only the found element");
    } else {
      console.log(`No element found for checkbox`);
      // Handle wait
      throw new Error(
        `No element found with the specific value ${question.answer} for question: ` +
          question.id
      );
    }
  }

  let inputElement = filteredElements[0];

  if (
    !(inputElement instanceof HTMLInputElement) ||
    !(inputElement instanceof HTMLSelectElement)
  ) {
    throw new Error("Element not correct property");
  }

  const isInput = inputElement.tagName.toLowerCase() === "input";
  const isTextarea = inputElement.tagName.toLowerCase() === "textarea";
  const isSelect = inputElement.tagName.toLowerCase() === "select";
  const isMultiSelect = inputElement.querySelector("fieldset") !== null;

  let inputType = isInput ? inputElement.getAttribute("type") : undefined;

  // Handling for multi-select (checkboxes within a fieldset)
  if (isMultiSelect) {
    // Assuming question.answer is an array for multi-select questions
    let answers = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];
    for (const answer of answers) {
      //yucky type shit
      let checkboxes = inputElement.querySelectorAll("input[type=checkbox]");
      checkboxes.forEach((checkbox) => {
        // First, assert that checkbox is indeed an HTMLInputElement
        const inputCheckbox = checkbox as HTMLInputElement;

        // Check if the next sibling is non-null and is an HTMLElement
        const nextSibling = inputCheckbox.nextSibling;
        if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE) {
          const siblingElement = nextSibling as HTMLElement;

          // Now we can safely access textContent
          if (
            siblingElement.textContent &&
            siblingElement.textContent.trim() === answer
          ) {
            inputCheckbox.checked = true;
          }
        }
      });
    }
  } else if (inputType === "radio" || inputType === "checkbox") {
    // For radio buttons and checkboxes not in a multi-select
    inputElement.checked = question.answer.includes(inputElement.value);
  } else if (inputType === "date") {
    // Handling for date inputs
    inputElement.value = question.answer; // Ensure question.answer is in YYYY-MM-DD format for date inputs
  } else if (inputType === "file") {
    // File inputs require a different approach, potentially using URL.createObjectURL() or handling through background scripts due to security restrictions
  } else {
    // General handling for text, number, email, etc.
    inputElement.value = question.answer;
  }

  // For SELECT elements, this requires iterating over options to find the match
  if (isSelect) {
    for (const option of inputElement.options) {
      if (option.value === question.answer || option.text === question.answer) {
        option.selected = true;
        break;
      }
    }
  }

  // Mark question as answered
  question.answered = true;
}

export async function isErrorPresent() {
  // Selector targeting a stable part of the error message structure
  const errorSelector = 'div[id*="errorText"]';
  const alertSelector = '[role="alert"]';

  // Find all elements that match the error selector
  const errorElements = document.querySelectorAll(errorSelector);
  const alertElements = document.querySelectorAll(alertSelector);

  // Check if any of these elements have at least one child
  for (const element of errorElements) {
    if (element.children.length > 0) {
      console.log("error found for element: \n", element);
      return true;
    }
  }

  // If any alert elements are found, return true
  if (alertElements.length > 0) {
    console.log("Alert element found");
    return true;
  }

  return false;
}
