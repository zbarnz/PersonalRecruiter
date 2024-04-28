import { AutoApply } from "../entity/AutoApply";
import { Exception } from "../entity/Exception";
import { getConnection } from "../data-source";

import { getApplyResourcesHelper } from "./applyResources";

import { Request, Response } from "express";
import { DataSource } from "typeorm";

import { JobBoard } from "../entity/JobBoard";
import { User } from "../entity/User";

//helpers

export const createApplyHelper = async (a: AutoApply): Promise<AutoApply> => {
  const connection: DataSource = await getConnection();

  const existingApply = await connection.manager.findOne(AutoApply, {
    where: { listing: a.listing, user: a.user },
    relations: ["listing", "user"],
  });

  if (existingApply) {
    return existingApply;
  }

  const applyEntity = connection.manager.create(AutoApply, a);
  const savedApply = await connection.manager.save(applyEntity);
  return savedApply;
};

export const saveApplyHelper = async (a: AutoApply): Promise<AutoApply> => {
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
    const autoApply: AutoApply = req.body.autoApply;

    const getCoverLetter: boolean = req.body.getCoverLetter;
    const getResume: boolean = req.body.getResume;
    const questions: any | null = req.body.questions;

    const getAnswers = questions?.length ? true : false;

    console.log(autoApply);
    console.log(questions);
    console.log({ getResume, getCoverLetter, getAnswers });

    let documents: Documents = {
      coverLetter: null,
      resume: null,
      answeredQuestions: null,
    };

    const savedApply = await createApplyHelper(autoApply);

    console.log(savedApply);

    if (getCoverLetter || getResume || getAnswers) {
      documents = await getApplyResourcesHelper(
        savedApply.user,
        savedApply.listing,
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
    let jobBoard: JobBoard = req.body.jobBoard;
    let user: User = req.body.user;

    let jobBoardId = jobBoard.id;
    let userId = user.id;

    const connection = await getConnection();

    for (let listingId of listings) {
      //I dont think there is a way to merge these two queries in typeorm
      const autoApplyRecords = await connection.manager
        .createQueryBuilder(AutoApply, "aop")
        .innerJoinAndSelect(
          "aop.listing",
          "lis",
          "lis.jobListingId = :listingId",
          { listingId }
        )
        .innerJoinAndSelect("lis.jobBoard", "job", "job.id = :jobBoardId", {
          jobBoardId,
        })
        .innerJoinAndSelect("aop.user", "usr", "usr.id = :userId", { userId })
        .where("aop.failedFlag = :failedFlag", { failedFlag: false })
        .andWhere("aop.completedFlag = :completedFlag", { completedFlag: true })
        .getMany();

      // Query Exception records
      const exceptionRecords = await connection.manager
        .createQueryBuilder(Exception, "exc")
        .innerJoinAndSelect(
          "exc.listing",
          "lis",
          "lis.jobListingId = :listingId",
          { listingId }
        )
        .innerJoinAndSelect("lis.jobBoard", "job", "job.id = :jobBoardId", {
          jobBoardId,
        })
        .innerJoinAndSelect("exc.user", "usr", "usr.id = :userId", { userId })
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

export const completeApply = async (req: Request, res: Response) => {
  try {
    const autoApplyId: AutoApply["id"] = Number(req.params.id); // Assuming ID comes from URL parameters
    const autoApply = await getApplyHelper(autoApplyId);

    if (!autoApply) {
      return res.status(404).json({ error: "AutoApply not found." });
    }

    autoApply.completedFlag = true;
    await saveApplyHelper(autoApply);

    res.json(autoApply);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const autoApplyController = {
  completeApply,
  getApply,
  createApply,
  removeAppliedListings,
};
export default autoApplyController;
