import { Listing } from "../../entity/Listing";
import { User } from "../../entity/User";

import { logger } from "../../../lib/logger/pino.config";

import { GPTText } from "../../GPT/index";

import { summarizeDescriptionPrompt } from "../prompts/summarizeDescription";

export async function summarizeJobDescription(
  listing: Listing,
  user?: User
): Promise<string> {
  let completionText: any;
  let retries: number = 0;

  logger.info("Summarizing Job description");

  const prompt = summarizeDescriptionPrompt(
    listing.company,
    listing.description
  );

  ({ text: completionText } = await GPTText(
    prompt,
    user,
    undefined,
    undefined,
    listing,
    undefined,
    undefined,
    user ? false : true
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
