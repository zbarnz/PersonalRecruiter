import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";
import { AutoApply } from "../../entity/AutoApply";

import { getAnswersPrompt } from "../../GPT/prompts/getAnswers";

import { isValidJson } from "../../lib/utils/parsing";

import { GPTText } from "../index";

import { EntityManager } from "typeorm";

import dotenv from "dotenv";
dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function answerQuestions(
  autoApply: AutoApply,
  user: User,
  listing: Listing,
  questions: any
) {
  try {
    let completionText: string = "";
    let retries: number = 0;
    let previousLogId: number;

    if (
      user &&
      user.summarizedResume &&
      listing &&
      listing.summarizedJobDescription
    ) {
      const prompt = getAnswersPrompt(
        listing.summarizedJobDescription,
        user.summarizedResume,
        JSON.stringify(questions)
      );

      while (retries < MAX_RETRIES && !isValidJson(completionText)) {
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

        completionText = completionText
          .replace(/\`\`\`json\n/, "")
          .replace(/\n\`\`\`/, ""); //TODO figure out how to make the call better so i dont have to do this
        console.log("GPT Attempt #:" + retries);
      }

      if (!isValidJson(completionText)) {
        throw new Error("Could not get valid JSON from GPT call");
      }

      return JSON.parse(completionText);
    }
  } catch (error) {
    throw new Error("Failed to answer questions: " + error.message);
  }
}
