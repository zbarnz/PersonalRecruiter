import { Listing } from "../../entity/Listing.ts";
import { User } from "../../entity/User.ts";

import { summarizeDescriptionPrompt } from "../../src/prompts/apply/summarizeDescription.ts";
import { GPTText } from "../index";

async function summarizeJobDescription(
  company: string,
  jobDescription: string,
  listing: Listing,
  user: User
) {
  let completionText: string;
  let retries: number = 0;

  console.log("Summarizing Job description");

  const prompt = summarizeDescriptionPrompt(company, jobDescription);

  ({ text: completionText } = await GPTText(
    prompt,
    user,
    undefined,
    undefined,
    listing,
    undefined
  ));

  return completionText;
}
