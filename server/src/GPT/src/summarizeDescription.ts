import { Listing } from "../../entity";

import { logger } from "../../../lib/logger/pino.config";

import { GPTText } from "../../GPT/index";

import { summarizeDescriptionPrompt } from "../prompts/summarizeDescription";

export async function summarizeJobDescription(
  listing: Listing
): Promise<string> {
  let completionText: any;

  logger.info("Summarizing Job description");

  const prompt = summarizeDescriptionPrompt(
    listing.company,
    listing.description
  );

  ({ text: completionText } = await GPTText(
    prompt,
    null,
    undefined,
    undefined,
    listing,
    undefined,
    undefined,
    true
  ));

  if (listing.questionsObject) {
    let qualificationsString = "\n\nMinimum Qualifications:\n";
    for (const qualification in listing.questionsObject) {
      qualificationsString += qualification + "\n";
    }
    completionText += qualificationsString;
  }

  return completionText;
}
