import { getSkillsPrompt } from "../prompts/getSkills";
import { removeSoftSkillsPrompt } from "../prompts/removeSoftSkills";

import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { isValidArray } from "../../lib/utils/parsing";

import { compileHTMLtoPDF } from "lib/utils/pdf";

import { resumeWSkills } from "../../src/apply_assets/resume";

import { GPTText } from "../index";

import { EntityManager } from "typeorm";

import dotenv from "dotenv";
dotenv.config();

const MAX_RETRIES = Number(process.env.MAX_GPT_RETRIES);

export async function getResume(
  user: User,
  listing?: Listing
): Promise<Buffer> {
  let completionText: string = "";
  let retries: number = 0;
  let previousLogId: number;

  console.log("Compiling Resume");

  const skillsPrompt = getSkillsPrompt(listing.description, user.skills);

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
    console.log("GPT Attempt #:" + retries);
  }

  if (!isValidArray(completionText)) {
    throw new Error("Could not get valid JSON from GPT call");
  }

  console.log("getSkills GPT Completion w/ soft: " + completionText);
  const skillsWithSoft = JSON.parse(completionText);
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
    console.log("GPT Attempt #:" + retries);
  }

  if (!isValidArray(completionText)) {
    throw new Error("Could not get valid JSON from GPT call");
  }

  console.log("getSkills GPT Completion: " + completionText);

  const skillsArray: string[] = JSON.parse(completionText);

  const resume = resumeWSkills(skillsArray); //TODO custome resume handler

  const pdfBuffer = await compileHTMLtoPDF(resume);

  return pdfBuffer;
}
