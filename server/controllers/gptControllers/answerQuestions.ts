import { User } from "entity/User";
import { Listing } from "entity/Listing";
import { AutoApply } from "entity/AutoApply";

import { getApplyHelper } from "controllers/autoApply";
import { getListingByIdHelper } from "controllers/listing";
import { getUserHelper } from "controllers/user";

import { getAnswersPrompt } from "src/prompts/getAnswers";

import { isValidJson } from "lib/utils/parsing";

import { GPTText } from "../../GPT/index";

import { Response, Request } from "express";

import dotenv from "dotenv";
dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function answerQuestions(req: Request, res: Response) {
  try {
    let completionText: string;
    let retries: number = 0;
    let previousLogId: number;

    const questions: any[] = req.body.questions;
    const userId: User["id"] = req.body.userId;
    const listingId: Listing["id"] = req.body.listingId;
    const autoApplyId: AutoApply["id"] = req.body.autoApplyId;

    const autoApply: AutoApply = await getApplyHelper(autoApplyId);
    const listing: Listing = await getListingByIdHelper(listingId);
    const user: User = await getUserHelper(userId);

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

    res.json(JSON.parse(completionText));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
}
