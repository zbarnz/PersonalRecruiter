import { mediumWait, shortWait } from "../../../lib/utils/waits";
import { handleDocumentsPage } from "./handleDocumentsPage";

//indeed is too smart for element.value so lets simulate user interaction
function changeInputValue(value: string, inputElement: HTMLElement) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(inputElement, value);

  inputElement.dispatchEvent(new Event("input", { bubbles: true }));
}

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
    console.log("filling question: " + JSON.stringify(answeredQuestions[i]));
    await fillQuestion(answeredQuestions[i]);
  }
}

export async function fillQuestion(
  question: any,
  coverLetter?: {
    buffer: Buffer | null;
    text: string | null;
  } | null
) {
  let elementArr: HTMLElement[];

  if (question.answered) {
    console.log(
      "skipping answered question: " + question.viewId || question.name
    );
    return;
  }

  const elementIdSelectorId = `[id*="${question.viewId}"]`;
  const elementIdSelectorName = `[id*="${question.name}"]`;

  let elementsById = document.querySelectorAll(elementIdSelectorId);
  let elementsByName = document.querySelectorAll(elementIdSelectorName);

  elementArr =
    ([...elementsByName] as HTMLElement[]) ||
    ([...elementsById] as HTMLElement[]);

  const validElementTags = ["input", "textarea", "select"];

  let filteredElements = elementArr
    .map((element) => {
      const tagName = element.tagName.toLowerCase();
      const containsFieldset =
        tagName === "div" && element.querySelector("fieldset") !== null;

      return containsFieldset || validElementTags.includes(tagName)
        ? element
        : null;
    })
    .filter((element) => element !== null);

  console.log(
    "element arr: \n" +
      JSON.stringify(elementArr) +
      "\n for question: \n" +
      JSON.stringify(question)
  );

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
      const nextSibling = element.nextElementSibling;
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

  if (!inputElement) {
    throw new Error(
      "This should never happen we ensure that above but if youre seeing this the evaluated input element doesnt exist for some reason"
    );
  }

  const isInput = inputElement.tagName.toLowerCase() === "input";
  const isTextarea = inputElement.tagName.toLowerCase() === "textarea";
  const isSelect = inputElement.tagName.toLowerCase() === "select";
  const isMultiSelect = inputElement.querySelector("fieldset") !== null;

  let inputType = isInput ? inputElement.getAttribute("type") : undefined;

  if (!isInput && !isTextarea && !isSelect && !isMultiSelect) {
    // Find the nearest child input element
    const childInput = inputElement.querySelector("input");

    if (childInput) {
      // Replace the current element with the child input element
      inputElement = childInput;
      console.log("Replaced element with nearest child input element.");
    } else {
      console.log("No child input element found.");
      // Handle the case where no child input is found
    }
  }

  if (!inputType && isInput) {
    const placeholder = inputElement.getAttribute("placeholder");
    const slashCount = placeholder ? placeholder.split("/").length - 1 : 0;

    if (slashCount == 2) {
      inputType = "date";
    }
  }

  /********************** 
  START HANDLING ACTIONS
  ***********************/

  console.log(inputElement);
  console.log("input type: " + inputType);

  // Handling for multi-select (checkboxes within a fieldset)
  if (isMultiSelect) {
    console.log("filling multiSelect");
    let answers = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];
    for (const answer of answers) {
      let checkboxes = inputElement.querySelectorAll("input[type=checkbox]");
      checkboxes.forEach((checkbox) => {
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
            inputCheckbox.click();
          }
        }
      });
    }
    question.answered = true;
    return;
  } else if (
    inputElement instanceof HTMLInputElement &&
    (inputType === "radio" || inputType === "checkbox")
  ) {
    console.log("filling checkbox with " + question.answer);
    // For radio buttons and checkboxes not in a multi-select
    inputElement.click();
    question.answered = true;
    return;
  } else if (inputElement instanceof HTMLInputElement && inputType === "date") {
    console.log("filling date with " + question.answer);
    // Handling for date inputs
    changeInputValue(question.answer, inputElement);
    question.answered = true;
    return;
  } else if (inputElement instanceof HTMLInputElement && inputType === "file") {
    console.log("filling file input with " + question.answer);
    // File inputs require a different approach, potentially using URL.createObjectURL() or handling through background scripts due to security restrictions
    if (coverLetter) {
      await handleDocumentsPage(coverLetter);
    }
    question.answered = true;
    return;
  } else if (inputElement instanceof HTMLInputElement) {
    // General handling for text, number, email, etc.
    console.log("filling (other) input with " + question.answer);
    changeInputValue(question.answer, inputElement);

    question.answered = true;
    return;
  } else if (isTextarea) {
    // General handling for text, number, email, etc.
    console.log("filling (other) input with " + question.answer);
    changeInputValue(question.answer, inputElement);

    question.answered = true;
    return;
  } else if (isSelect) {
    console.log("filling select with " + question.answer);
    // For SELECT elements, this requires iterating over options to find the match
    if (inputElement instanceof HTMLSelectElement) {
      for (const option of inputElement.options) {
        if (
          option.value === question.answer ||
          option.text === question.answer
        ) {
          option.selected = true;
          break;
        }
      }
      question.answered = true;
      return;
    }
  }

  throw new Error(
    "Cant handle " + inputElement.toString() + `\n` + "of type " + inputType
  );
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
