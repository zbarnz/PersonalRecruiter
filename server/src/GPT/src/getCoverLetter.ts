import { coverLetter } from "../../document_generators/coverLetter";
import { getCoverLetterPrompt } from "../prompts/getCoverLetter";

import { logger } from "../../../lib/logger/pino.config";

import { compileHTMLtoPDF } from "../../../lib/utils/pdf";

import { Listing, User, UserApplicantConfig } from "../../entity";

import { GPTText } from "../index";

import { summarizeJobDescription } from "./summarizeDescription";

import fs from "fs/promises";

export async function generateCoverLetter(
  user: User,
  listing: Listing,
  userApplicantConfig: UserApplicantConfig
): Promise<{ buffer: Buffer; text: string }> {
  try {
    let summarizedDescription: string = "";

    if (!userApplicantConfig.summarizedResume) {
      throw new Error("user applicant summarized resume not found");
    }

    if (!listing.summarizedJobDescription) {
      summarizedDescription = await summarizeJobDescription(listing);
    }

    if (!listing.summarizedJobDescription && !summarizedDescription) {
      throw new Error("Cannot get summarized job description");
    }

    const prompt = getCoverLetterPrompt(
      userApplicantConfig.summarizedResume,
      listing.summarizedJobDescription || summarizedDescription
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
    const clHTML = coverLetter(removedNewLines, user, userApplicantConfig);

    const pdfBuffer = await compileHTMLtoPDF(clHTML);

    return { buffer: pdfBuffer, text: parsedText };
  } catch (err) {
    throw new Error("Failed to generate cover letter: " + err.message);
  }
}
