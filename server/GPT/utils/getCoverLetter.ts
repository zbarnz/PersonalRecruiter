import { getCoverLetterPrompt } from "../prompts/getCoverLetter";
import { coverLetter } from "../../src/apply_assets/coverletter";

import { compileHTMLtoPDF } from "../../lib/utils/pdf";

import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { GPTText } from "../index";

import { EntityManager } from "typeorm";

export async function generateCoverLetter(
  user: User,
  listing: Listing
): Promise<Buffer> {
  if (
    user &&
    user.summarizedResume &&
    listing &&
    listing.summarizedJobDescription
  ) {
    const prompt = getCoverLetterPrompt(
      user.summarizedResume,
      listing.summarizedJobDescription
    );

    let retries: number = 0;
    let completionText: string;

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
      user.firstName + " " + user.lastName,
      user.phone,
      user.email,
      user.website
    );

    const pdfBuffer = await compileHTMLtoPDF(clHTML);

    return pdfBuffer;
  } else {
    throw new Error("User or listing missing summarization");
  }
}
