import { Request, Response } from "express";

import { AutoApply, Listing, PDF, User, UserApplicantConfig } from "../entity";

import { logger } from "../../lib/logger/pino.config";

import { answerQuestions } from "../GPT/src/answerQuestions";
import { generateCoverLetter } from "../GPT/src/getCoverLetter";
import { getResume } from "../GPT/src/getResume";

import { getApplyHelper } from "./autoApply";
import { setGPTLogBatchAsFailedHelper } from "./gPTLog";
import { getListingByIdHelper } from "./listing";
import { getUserHelper } from "./user";

import { getConnection } from "../../data-source";

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

    if (!user) {
      throw new Error("No user passed to apply resource handler");
    }

    if (!listing) {
      throw new Error("No listing passed to apply resource handler");
    }

    const userApplicantConfig: UserApplicantConfig =
      await connection.manager.findOne(UserApplicantConfig, {
        where: { user: user.id },
      });

    //set batchId for marking as failed (we dont want to rollback gpt logs)
    const batchId = Math.floor(Date.now() / 1000); //unix

    try {
      if (getCoverLetterFlag) {
        logger.info("Generating Cover Letter");
        coverLetter = await generateCoverLetter(
          user,
          listing,
          userApplicantConfig
        );

        const pdfRecord = new PDF();
        pdfRecord.user = user;
        pdfRecord.type = "Cover Letter";
        pdfRecord.pdfData = coverLetter.buffer;
        const pdfEntity = transactionalEntityManager.create(PDF, pdfRecord);
        await transactionalEntityManager.save(pdfEntity);
      }

      if (getResumeFlag) {
        logger.info("Generating Resume");

        resume = await getResume(user, listing, userApplicantConfig);

        const pdfRecord = new PDF();
        pdfRecord.user = user;
        pdfRecord.type = "Resume";
        pdfRecord.pdfData = resume;
        const pdfEntity = transactionalEntityManager.create(PDF, pdfRecord);
        await transactionalEntityManager.save(pdfEntity);
      }

      if (getAnswersFlag) {
        logger.info("Answering questions");
        answeredQuestions = await answerQuestions(
          autoApply,
          user,
          userApplicantConfig,
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

      throw new Error("Failed to get Documents: " + err.message);
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
