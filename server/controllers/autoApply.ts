import { AutoApply } from "../entity/AutoApply";
import { Exception } from "../entity/Exception";
import { getConnection } from "../data-source";

import { getApplyResourcesHelper } from "./applyResources";

import { Request, Response } from "express";
import { DataSource } from "typeorm";

//helpers

export const createApplyHelper = async (a: AutoApply): Promise<AutoApply> => {
  const connection: DataSource = await getConnection();
  const savedApply = await connection.manager.save(a);
  return savedApply;
};

export const getApplyHelper = async (
  id: AutoApply["id"]
): Promise<AutoApply> => {
  const connection = await getConnection();
  const autoApply = await connection.manager.findOne(AutoApply, {
    where: { id: Number(id) },
  });
  return autoApply;
};

//controllers

export const createApply = async (req: Request, res: Response) => {
  try {
    const autoApply: AutoApply = req.body;

    const getCoverLetter: boolean = req.body.getCoverLetter;
    const getResume: boolean = req.body.getResume;
    const getAnswers: boolean = req.body.getAnswers;
    const questions: any = req.body.questions;

    let documents: Documents = {
      coverLetter: null,
      resume: null,
      answeredQuestions: null,
    };

    const savedApply = await createApplyHelper(autoApply);

    if (getCoverLetter || getResume || getAnswers) {
      documents = await getApplyResourcesHelper(
        autoApply.user,
        autoApply.listing,
        getCoverLetter,
        getResume,
        getAnswers,
        questions,
        savedApply
      );
    }
    res.json({ savedApply, documents });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getApply = async (req: Request, res: Response) => {
  try {
    const autoApplyId = Number(req.params._id); // Assuming ID comes from URL parameters

    const autoApply = await getApplyHelper(autoApplyId);

    if (!autoApply) {
      return res.status(404).json({ error: "AutoApply not found." });
    }

    res.json(autoApply);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const removeAppliedListings = async (req: Request, res: Response) => {
  try {
    let listings: string[] = req.body.jobKeys; // Assuming ID comes from URL parameters
    let jobBoard: number = req.body.jobBoard;
    let userId: number = req.body.userId;

    const connection = await getConnection();

    for (let listingId of listings) {
      //I dont think there is a way to merge these two queries in typeorm
      const autoApplyRecords = await connection.manager
        .createQueryBuilder(AutoApply, "aop")
        .innerJoinAndSelect(
          "aop.listingId",
          "listing",
          "listing.jobListingId = :listingId AND listing.jobBoard = :jobBoard",
          { listingId, jobBoard }
        )
        .where("aop.failedFlag = :failedFlag", { failedFlag: false })
        .andWhere("aop.completedFlag = :completedFlag", { completedFlag: true })
        .andWhere("aop.userId = :userId", { userId })
        .getMany();

      // Query Exception records
      const exceptionRecords = await connection.manager
        .createQueryBuilder(Exception, "exc")
        .where("exc.listingId = :listingId", { listingId })
        .andWhere("exc.jobBoard = :jobBoard", { jobBoard })
        .andWhere("exc.userId = :userId", { userId })
        .getMany();

      // Check if any AutoApply or Exception records exist
      if (autoApplyRecords.length > 0 || exceptionRecords.length > 0) {
        listings = listings.filter((id) => id !== listingId);
      }
    }

    res.json(listings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const autoApplyController = { getApply, createApply, removeAppliedListings };
export default autoApplyController;
