import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { getCoverLetterPrompt } from "../../src/prompts/getCoverLetter";
import { coverLetter } from "../../src/apply_assets/coverletter";

import { GPTText } from "..";

export async function generateCoverLetter(
  aiStructuredResume: string,
  jobDescription: string,
  listing: Listing,
  user: User
): Promise<string> {
  const prompt = getCoverLetterPrompt(aiStructuredResume, jobDescription);
  let retries: number = 0;
  let completionText: string;
  let clPath: string;

  ({ text: completionText } = await GPTText(
    prompt,
    user,
    undefined,
    undefined,
    listing
  ));

  function removePlaceholders(input: string): string {
    return input.replace(/\[.*?\]/g, "");
  }

  let parsedText = removePlaceholders(completionText).replace(/\n/g, "<br>");

  console.log("GPT Attempt #:" + retries);

  const clHTML = coverLetter(
    parsedText,
    "Zach Barnes",
    "720-755-7572",
    "zbarnz99@gmail.com",
    "https://zachbarnes.dev"
  );

  return clHTML;
}
