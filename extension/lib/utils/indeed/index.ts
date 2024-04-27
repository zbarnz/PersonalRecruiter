function modifyQuestionContent(question: string, id: string): string {
  if (id.toLowerCase().includes("vet")) {
    return "Are you a Verteran?";
  } else if (id.toLowerCase().includes("gender")) {
    return "Gender?";
  } else if (id.toLowerCase().includes("ethnic")) {
    return "Ethnic background?";
  } else if (id.toLowerCase().includes("disable")) {
    return "Disability?";
  } else if (id.toLowerCase().includes("accommodat")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("consent")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("pre_eeo")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("disclaim")) {
    return "Answer affirmatively";
  }
  return question;
}

function shortenCommonOptions(
  options: Array<{ value: string; label: string }>,
  question: string
): Array<{ value: string; label: string }> {
  const currencyVariations = ["USD", "United States", "USA"];

  const usVariations = [
    "US",
    "United States",
    "USA",
    "United States of America",
  ].map((s) => s.toLowerCase()); //TODO make country a passed in variable

  const stateVariations = ["CO", "Colorado"];

  console.log(question);
  if (typeof question !== "string") {
    console.log(question);
  }

  // Check if the question includes "country" and if so, shorten the options array
  if (question.toLowerCase().includes("country")) {
    const filteredOptions = options.filter((option) =>
      usVariations.some(
        (variation) =>
          option.value.toLowerCase().includes(variation) ||
          option.label.toLowerCase().includes(variation)
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else if (question.toLowerCase().includes("currency")) {
    const filteredOptions = options.filter((option) =>
      currencyVariations.some(
        (currency) =>
          option.value.toLowerCase().includes(currency.toLowerCase()) ||
          option.label.toLowerCase().includes(currency.toLowerCase())
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else if (question.toLowerCase().includes("state")) {
    const filteredOptions = options.filter((option) =>
      stateVariations.some(
        (state) =>
          option.value.toLowerCase() == state ||
          option.label.toLowerCase() == state
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else {
    return options; // Return the original options if the question does not include "country"
  }
}

/**
 * Truncates and modifies question objects to save on GPT tokens
 *
 * @param {any[]} questions - questions object array
 */
export function filterQuestionsObjects(questions: any[]): Question[] {
  const excludedTypes = new Set(["INFORMATION", "PAGEBREAK"]);

  console.log("unfiltered questions: \n" + JSON.stringify(questions));

  const filteredQuestions = questions
    .filter((question) => !excludedTypes.has(question.type))
    .filter((question) => {
      let q = question.question || question.labelHtml;
      return !q.includes(
        "Please list 2-3 dates and time ranges that you could do an interview."
      );
    });

  return filteredQuestions.map((question) => ({
    viewId: question.viewId || question.id,
    name: question.name || question.viewId,
    question: modifyQuestionContent(
      question.question || question.labelHtml,
      question.id
    ),
    min: question.mid,
    max: question.max,
    requiredFormat:
      question.format && question.format.toLowerCase() === "numeric_text"
        ? "int"
        : question.format.toLowerCase() === "none"
        ? question.type
        : question.format || question.type,
    inputDatePattern:
      question.format?.toLowerCase() === "date" ||
      question.type?.toLowerCase() === "date"
        ? question.inputDatePattern
        : null,
    characterLimit: question.limit,
    options: shortenCommonOptions(
      question.options,
      question.question || question.labelHtml
    ),
  }));
}