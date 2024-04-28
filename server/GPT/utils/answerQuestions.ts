import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";
import { AutoApply } from "../../entity/AutoApply";

import { getAnswersPrompt } from "../../GPT/prompts/getAnswers";

import { isValidArray, isValidJson } from "../../lib/utils/parsing";

import { GPTText } from "../index";

import dotenv from "dotenv";
import { error } from "console";
dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function answerQuestions(
  autoApply: AutoApply,
  user: User,
  listing: Listing,
  questions: any
) {
  try {
    let completionText: any = "";
    let retries: number = 0;
    let previousLogId: number;

    const prompt = getAnswersPrompt(
      listing.summarizedJobDescription,
      user.summarizedResume,
      JSON.stringify(questions)
    );

    while (retries < MAX_RETRIES && !isValidArray(completionText)) {
      ({ text: completionText, prevLogId: previousLogId } = await GPTText(
        prompt,
        user,
        previousLogId,
        autoApply,
        listing,
        "gpt-4-1106-preview",
        "Output in JSON"
      ));
      retries++;

      const arrayRegex = /\[.*?\]/gs;
      completionText = JSON.parse(completionText.match(arrayRegex)[0]);
      console.log(completionText);
      console.log("GPT Attempt #:" + retries);
    }

    if (!isValidArray(completionText)) {
      throw new Error("Could not get valid JSON from GPT call");
    }

    return completionText;
  } catch (error) {
    throw new Error("Failed to answer questions: " + error.message);
  }
}
