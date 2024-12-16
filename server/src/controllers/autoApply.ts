import { AutoApply, Exception, JobBoard, Listing, User } from "../entity";

import { getConnection } from "../../data-source";

import { logger } from "../../lib/logger/pino.config";

import { getApplyResourcesHelper } from "./applyResources";

import { Request, Response } from "express";
import { DataSource, EntityMetadata } from "typeorm";

//helpers

// TODO use better variable name for auto apply
export const createApplyHelper = async (a: AutoApply): Promise<AutoApply> => {
  const connection: DataSource = await getConnection();
  const existingApply = await connection.manager.findOne(AutoApply, {
    where: {
      listing: { id: a.listing.id },
      user: { id: a.user.id },
    },
    relations: ["listing", "user", "listing.jobBoard"],
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

    autoApply.customCoverLetter = getCoverLetter;
    autoApply.customResume = getResume;

    const getAnswers = questions?.length ? true : false;

    let documents: Documents = {
      coverLetter: null,
      resume: null,
      answeredQuestions: null,
    };

    const savedApply = await createApplyHelper(autoApply);

    logger.info("apply saved", savedApply);

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
    res.json({ autoApply: savedApply, documents });
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

export const getApplysForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.credentials.user.id;
    const {
      page = 1,
      pageSize = 10,
      orderBy = "dateApplied",
      orderDirection = "DESC",
      filters = {},
    } = req.body;

    const connection = await getConnection();
    const metadata = connection.getMetadata(AutoApply);

    const isOrderableColumn = (metadata: EntityMetadata, orderBy: string) => {
      // Check if the column is directly on the main entity
      if (metadata.columns.some((column) => column.propertyName === orderBy)) {
        return true;
      }

      // Check if the column exists in related entities
      for (const relation of metadata.relations) {
        const relatedMetadata = connection.getMetadata(relation.type);
        if (orderBy.startsWith(`${relation.propertyName}.`)) {
          const [, relatedColumn] = orderBy.split(`${relation.propertyName}.`);
          if (
            relatedMetadata.columns.some(
              (column) => column.propertyName === relatedColumn
            )
          ) {
            return true;
          }
        }
      }

      return false;
    };

    if (!isOrderableColumn(metadata, orderBy)) {
      return res.status(400).json({
        error: `Ordering error. Please try again`,
      });
    }

    // Validate orderDirection
    const validDirections = ["ASC", "DESC"];
    if (!validDirections.includes(orderDirection.toUpperCase())) {
      return res.status(400).json({
        error: `Ordering error. Please try again`,
      });
    }

    // Validate and process filters
    const where = Object.keys(filters).reduce(
      (where, key) => {
        if (metadata.columns.some((column) => column.propertyName === key)) {
          where[key] = filters[key];
        } else {
          res.status(400).json({
            error: `Filtering error. Please try again`,
          });
          return where;
        }
        return where;
      },
      { user: { id: userId } } as Record<string, any>
    ); // Include user filter

    //BUILD QUERY
    /******************************************************************************** */

    const queryBuilder = connection
      .getRepository(AutoApply)
      .createQueryBuilder("autoApply")
      .leftJoinAndSelect("autoApply.listing", "listing")
      .leftJoinAndSelect("listing.jobBoard", "jobBoard")
      .leftJoinAndSelect("autoApply.user", "user");

    // Add where conditions if needed
    if (where) {
      queryBuilder.where(where);
    }

    // Validate and set the order clause
    if (orderBy.includes(".")) {
      const [relation, column] = orderBy.split(".");
      if (!["listing", "jobBoard", "user"].includes(relation)) {
        return res.status(400).json({
          error: `Invalid relation '${relation}' in orderBy.`,
        });
      }

      // Ensure the column exists in the relation's metadata
      const relatedMetadata = connection.getMetadata(
        relation === "listing" ? Listing : JobBoard
      ); // Adjust accordingly
      if (!relatedMetadata.columns.some((col) => col.propertyName === column)) {
        return res.status(400).json({
          error: `Column '${column}' does not exist on relation '${relation}'.`,
        });
      }

      queryBuilder.orderBy(
        `${relation}.${column}`,
        orderDirection.toUpperCase() as "ASC" | "DESC"
      );
    } else {
      const metadata = connection.getMetadata(AutoApply);
      if (!metadata.columns.some((col) => col.propertyName === orderBy)) {
        return res.status(400).json({
          error: `Column '${orderBy}' does not exist on 'AutoApply'.`,
        });
      }

      queryBuilder.orderBy(
        `autoApply.${orderBy}`,
        orderDirection.toUpperCase() as "ASC" | "DESC"
      );
    }

    // Apply pagination
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    // Execute query
    const [results, total] = await queryBuilder.getManyAndCount();

    /********************************************************************************/
    //END QUERY

    res.json({
      autoApply: results,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
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
    let user: User = req.credentials.user;

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
  getApplysForUser,
};
export default autoApplyController;
