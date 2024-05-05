import { getSkillsPrompt } from "../prompts/getSkills";
import { removeSoftSkillsPrompt } from "../prompts/removeSoftSkills";

import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { logger } from "../../lib/logger/pino.config";


import { isValidArray } from "../../lib/utils/parsing";

import { compileHTMLtoPDF } from "../../lib/utils/pdf";

import { setGPTLogAsFailedHelper } from "../../controllers/gPTLog";

import { resumeWSkills } from "../../src/apply_assets/resume";

import { GPTText } from "../index";

import dotenv from "dotenv";
dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function getResume(
  user: User,
  listing?: Listing
): Promise<Buffer> {
  let completionText: any = "";
  let retries: number = 0;
  let previousLogId: number;

  logger.info("Compiling Resume");

  try {
    const skillsPrompt = getSkillsPrompt(
      listing.summarizedJobDescription,
      user.skills
    );

    while (retries < MAX_RETRIES && !isValidArray(completionText)) {
      ({ text: completionText, prevLogId: previousLogId } = await GPTText(
        skillsPrompt,
        user,
        previousLogId!,
        undefined,
        listing,
        undefined,
        "Output in JSON"
      ));
      retries++;

      const arrayRegex = /\[.*?\]/gs;
      completionText = JSON.parse(completionText.match(arrayRegex)[0]);
      logger.info(completionText);
      logger.info("GPT Attempt #:" + retries);
    }

    if (!isValidArray(completionText)) {
      await setGPTLogAsFailedHelper(previousLogId);
      throw new Error("Could not get valid JSON from GPT call");
    }

    logger.info("getSkills GPT Completion w/ soft: " + completionText);
    const skillsWithSoft: any = completionText;
    const removeSoftSkills = removeSoftSkillsPrompt(skillsWithSoft);
    retries = 0;

    while (retries < MAX_RETRIES && !isValidArray(completionText)) {
      ({ text: completionText, prevLogId: previousLogId } = await GPTText(
        removeSoftSkills,
        user,
        previousLogId!,
        undefined,
        listing,
        undefined,
        "Output in JSON"
      ));

      retries++;
      const arrayRegex = /\[.*?\]/gs;
      completionText = JSON.parse(completionText.match(arrayRegex)[0]);
      logger.info(completionText);

      logger.info("GPT Attempt #:" + retries);
    }

    if (!isValidArray(completionText)) {
      await setGPTLogAsFailedHelper(previousLogId);
      throw new Error("Could not get valid JSON from GPT call");
    }

    logger.info("getSkills GPT Completion: " + completionText);

    const skillsArray: string[] = completionText;

    const resume = resumeWSkills(skillsArray); //TODO custome resume handler

    const pdfBuffer = await compileHTMLtoPDF(resume);

    return pdfBuffer;
  } catch (err) {
    throw new Error("Failed to generate resume letter: " + err.message);
  }
}
