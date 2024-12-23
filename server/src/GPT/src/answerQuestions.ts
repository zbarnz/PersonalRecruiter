import { AutoApply, Listing, User, UserApplicantConfig } from "../../entity";

import { logger } from "../../../lib/logger/pino.config";

import { getAnswersPrompt } from "../prompts/getAnswers";

import { isValidArray } from "../../../lib/utils/parsing";

import { summarizeJobDescription } from "./summarizeDescription";

import dotenv from "dotenv";

import { GPTText } from "../index";

dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function answerQuestions(
  autoApply: AutoApply,
  user: User,
  userApplicantConfig: UserApplicantConfig,
  listing: Listing,
  questions: any
) {
  try {
    let completionText: any = "";
    let retries: number = 0;
    let previousLogId: number | null = null;
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

    const prompt = getAnswersPrompt(
      listing.summarizedJobDescription || summarizedDescription,
      userApplicantConfig.summarizedResume,
      JSON.stringify(questions)
    );

    while (retries < MAX_RETRIES && !isValidArray(completionText)) {
      ({ text: completionText, prevLogId: previousLogId } = await GPTText(
        prompt,
        user,
        previousLogId,
        autoApply,
        listing,
        "gpt-4o",
        "Output in JSON"
      ));
      retries++;

      const arrayRegex = /\[.*?\]/gs;
      completionText = JSON.parse(completionText.match(arrayRegex)[0]);
      logger.info(completionText);
      logger.info("GPT Attempt #:" + retries);
    }

    if (!isValidArray(completionText)) {
      throw new Error("Could not get valid JSON from GPT call");
    }

    return completionText;
  } catch (error) {
    throw new Error("Failed to answer questions: " + error.message);
  }
}
