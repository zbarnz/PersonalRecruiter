import { Response, Request } from "express";

import { Listing } from "../entity/Listing";
import { User } from "../entity/User";
import { AutoApply } from "../entity/AutoApply";
import { PDF } from "../entity/PDF";

import { generateCoverLetter } from "../GPT/utils/getCoverLetter";
import { answerQuestions } from "../GPT/utils/answerQuestions";
import { getResume } from "../GPT/utils/getResume";

import { setGPTLogBatchAsFailedHelper } from "./gPTLog";
import { getListingByIdHelper } from "./listing";
import { getApplyHelper } from "./autoApply";
import { getUserHelper } from "./user";

import { getConnection } from "../data-source";

export async function getApplyResourcesHelper(
  user: User,
  listing: Listing,
  getCoverLetterFlag: boolean,
  getResumeFlag: boolean,
  getAnswersFlag: boolean,
  questions?: any,
  autoApply?: AutoApply
): Promise<Documents> {
  const connection = await getConnection();
  return await connection.transaction(async (transactionalEntityManager) => {
    let coverLetter: { buffer: Buffer | null; text: string | null } = null;
    let resume: Buffer | null = null;
    let answeredQuestions: any[] = null;

    //set batchId for marking as failed (we dont want to rollback gpt logs)
    const batchId = Math.floor(Date.now() / 1000); //unix

    try {
      if (getCoverLetterFlag) {
        const coverLetter = await generateCoverLetter(user, listing);

        const pdfRecord = new PDF();
        pdfRecord.user = user;
        pdfRecord.listing = listing;
        pdfRecord.type = "Cover Letter";
        pdfRecord.pdfData = coverLetter.buffer;
        transactionalEntityManager.save(PDF);
      }

      if (getResumeFlag) {
        resume = await getResume(user, listing);

        const pdfRecord = new PDF();
        pdfRecord.user = user;
        pdfRecord.listing = listing;
        pdfRecord.type = "Resume";
        pdfRecord.pdfData = resume;
        transactionalEntityManager.save(PDF);
      }

      if (getAnswersFlag) {
        answeredQuestions = await answerQuestions(
          autoApply,
          user,
          listing,
          questions
        );
      }

      return { coverLetter, resume, answeredQuestions };
    } catch (err) {
      try {
        setGPTLogBatchAsFailedHelper(batchId);
      } catch {
        throw new Error(
          "Failed to handle exception while getting documents: " + err.message
        );
      }

      throw new Error("Failed to get Documents " + err.message);
    }
  });
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
