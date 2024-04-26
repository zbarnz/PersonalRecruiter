import { Listing } from "entity/Listing";
import { User } from "entity/User";

import { GPTText } from "GPT";

import { summarizeDescriptionPrompt } from "../prompts/summarizeDescription";

export async function summarizeJobDescription(
  listing: Listing,
  requiredQualifications?: any,
  user?: User
): Promise<string> {
  let completionText: string;
  let retries: number = 0;

  console.log("Summarizing Job description");

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

  if (requiredQualifications) {
    let qualificationsString = "\n\nMinimum Qualifications:\n";
    for (const key in requiredQualifications) {
      if (requiredQualifications.hasOwnProperty(key)) {
        qualificationsString += requiredQualifications[key].join("\n") + "\n";
      }
    }
    completionText += qualificationsString;
  }

  return completionText;
}
