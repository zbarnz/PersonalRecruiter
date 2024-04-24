import { Response, Request } from "express";

import { Listing } from "entity/Listing";
import { User } from "entity/User";
import { AutoApply } from "entity/AutoApply";

import { generateCoverLetter } from "../GPT/utils/getCoverLetter";
import { answerQuestions } from "../GPT/utils/answerQuestions";
import { getResume } from "../GPT/utils/getResume";

import { getListingByIdHelper } from "./listing";
import { getApplyHelper } from "./autoApply";
import { getUserHelper } from "./user";
import { getSkillsPrompt } from "GPT/prompts/getSkills";

type Documents = {
  coverLetter: string | null;
  resume: string | null;
  answeredQuestions: any[] | null;
};

export async function getApplyResourcesHelper(
  user: User,
  listing: Listing,
  getCoverLetterFlag: boolean,
  getResumeFlag: boolean,
  getAnswersFlag: boolean,
  questions?: any,
  autoApply?: AutoApply
): Promise<Documents> {
  let coverLetter = null;
  let resume = null;
  let answeredQuestions = null;

  try {
    if (getCoverLetterFlag) {
      coverLetter = generateCoverLetter(user, listing);
    }

    if (getResumeFlag) {
      const skills = getSkillsPrompt(listing.description, user.skills);

      resume = getResume(user, listing);
    }

    if (getAnswersFlag) {
      answeredQuestions = answerQuestions(autoApply, user, listing, questions);
    }

    return { coverLetter, resume, answeredQuestions };
  } catch (err) {
    throw new Error("Failed to get Documents " + err.message);
  }
}

export async function getApplyResources(req: Request, res: Response) {
  try {
    const getCoverLetter: boolean = req.body.getCoverLetter;
    const getResume: boolean = req.body.getResume;
    const getAnswers: boolean = req.body.getAnswers;

    const userId: User["id"] = req.body.userId;
    const listingId: Listing["id"] = req.body.listingId;
    const autoApplyId: AutoApply["id"] = req.body.autoApplyId;

    const autoApply: AutoApply = await getApplyHelper(autoApplyId);
    const listing: Listing = await getListingByIdHelper(listingId);
    const user: User = await getUserHelper(userId);

    const documents: Documents = await getApplyResourcesHelper(
      user,
      listing,
      getCoverLetter,
      getResume,
      getAnswers,
      listing.questionsObject,
      autoApply
    );

    res.json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
}
