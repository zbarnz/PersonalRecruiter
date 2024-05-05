import { getCoverLetterPrompt } from "../prompts/getCoverLetter";
import { coverLetter } from "../../src/apply_assets/coverletter";

import { logger } from "../../lib/logger/pino.config";

import { compileHTMLtoPDF } from "../../lib/utils/pdf";

import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { GPTText } from "../index";

export async function generateCoverLetter(
  user: User,
  listing: Listing
): Promise<{ buffer: Buffer; text: string }> {
  try {
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

    let parsedText = removePlaceholders(completionText);

    logger.info("GPT Attempt #:" + retries);

    let removedNewLines = parsedText.replace(/\n/g, "<br>");
    const clHTML = coverLetter(
      removedNewLines,
      user.firstName + " " + user.lastName,
      user.phone,
      user.email,
      user.website
    );

    const pdfBuffer = await compileHTMLtoPDF(clHTML);

    return { buffer: pdfBuffer, text: parsedText };
  } catch (err) {
    throw new Error("Failed to generate cover letter: " + err.message);
  }
}
