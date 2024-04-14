import { AutoApply } from "../entity/AutoApply";
import { Exception } from "../entity/Exception";
import { getConnection } from "../data-source";

import { Request, Response } from "express";
import { JobBoard } from "entity/JobBoard";

export const createApply = async (req: Request, res: Response) => {
  try {
    const autoApply = req.body;
    const connection = await getConnection();
    const savedApply = await connection.manager.save(autoApply);
    res.json(savedApply);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getApply = async (req: Request, res: Response) => {
  try {
    const autoApplyId = req.params._id; // Assuming ID comes from URL parameters
    const connection = await getConnection();
    const autoApply = await connection.manager.findOne(AutoApply, {
      where: { id: Number(autoApplyId) },
    });

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
    let jobBoardId: number = req.body.jobBoard;
    let userId: number = req.body.userId;

    const connection = await getConnection();

    for (let listingId of listings) {
      //I dont think there is a way to merge these two queries in typeorm
      const autoApplyRecords = await connection.manager
        .createQueryBuilder(AutoApply, "aop")
        .where("aop.listingId = :listingId", { listingId })
        .andWhere("aop.failedFlag = :failedFlag", { failedFlag: false })
        .andWhere("aop.jobBoardId = :jobBoardId", { jobBoardId })
        .andWhere("aop.userId = :userId", { userId })
        .getMany();

      // Query Exception records
      const exceptionRecords = await connection.manager
        .createQueryBuilder(Exception, "exc")
        .where("exc.listingId = :listingId", { listingId })
        .andWhere("exc.jobBoardId = :jobBoardId", { jobBoardId })
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
