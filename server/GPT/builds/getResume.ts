import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { getSkillsPrompt } from "../../src/prompts/getSkills";
import {removeSoftSkillsPrompt} from '../../src/prompts/removeSoftSkills'
import { resumeWSkills } from "../../src/apply_assets/resume";

import { isValidArray } from "../../lib/utils/parsing";
import { GPTText } from "../";

import dotenv from "dotenv";

dotenv.config();
const MAX_GPT_RETRIES: number = parseInt(process.env.MAX_RETRIES || "3", 10);

async function getResume(
  skills: string[],
  jobDescription: string,
  user: User,
  listing?: Listing
): Promise<string> {
  let completionText: string = ''; 
  let previousLogId: number | undefined = undefined; 
  
  let retries: number = 0;

  console.log("Compiling Resume");

  const skillsPrompt = getSkillsPrompt(jobDescription, skills);

  while (retries < MAX_GPT_RETRIES && !isValidArray(completionText)) {
    ({ text: completionText, prevLogId: previousLogId } = await GPTText(
      skillsPrompt,
      user,
      previousLogId,
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

  while (retries < MAX_GPT_RETRIES && !isValidArray(completionText)) {
    ({ text: completionText, prevLogId: previousLogId } = await GPTText(
      removeSoftSkills,
      user,
      previousLogId,
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

  const resume = resumeWSkills(skillsArray);
  return resume;
}
