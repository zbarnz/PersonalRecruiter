import { Listing } from "../entity/Listing";
import { getConnection } from "../data-source";

import { User } from "../entity/User";
import { AutoApply } from "../entity/AutoApply";

import { Request, Response } from "express";

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

/**
 * Controller to create a listing.
 * @param {Request} req - Express request object containing listing data in the body.
 * @param {Response} res - Express response object for sending the response.
 */
export const createListing = async (req: Request, res: Response) => {
  try {
    const listing = req.body;
    const connection = await getConnection();

    const listingEntity = connection.manager.create(Listing, listing);
    const savedListing = await connection.manager.save(listingEntity);
    res.json(savedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to get a listing by jobListingId and jobBoardId.
 * @param {Request} req - Express request object, jobListingId and jobBoardId should be in the request parameters.
 * @param {Response} res - Express response object for sending the response.
 */
export const getListing = async (req: Request, res: Response) => {
  try {
    const { jobListingId, jobBoardId } = req.params;
    const connection = await getConnection();
    const listing = await connection.manager
      .createQueryBuilder(Listing, "listing")
      .where("listing.jobListingId = :jobListingId", { jobListingId })
      .andWhere("listing.jobBoardId = :jobBoardId", { jobBoardId })
      .getOne();
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to get a listing by ID.
 * @param {Request} req - Express request object, id should be in the request parameters.
 * @param {Response} res - Express response object for sending the response.
 */
export const getListingById = async (req: Request, res: Response) => {
  try {
    const id = req.params._id;
    const connection = await getConnection();
    const listing = await connection.manager.findOne(Listing, {
      where: { id: Number(id) },
    });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Finds listings in the database that have not been applied to by the user.
 * @param {Request} req - Express request object containing filter criteria.
 * @param {Response} res - Express response object for sending the found listings.
 */
export const getUnappliedListing = async (req: Request, res: Response) => {
  try {
    const {
      user,
      minSalary,
      remote,
      skills,
      matchSkills,
      requiredMatches,
      limit,
    } = req.body;
    const connection = await getConnection();

    let calculatedRequiredMatches =
      requiredMatches || Math.ceil((skills?.length || 0) * 0.1);
    let subQueries = (skills || [])
      .map(
        (skill) =>
          `(CASE WHEN lower(listing.description) ILIKE '%${skill.toLowerCase()}%' THEN 1 ELSE 0 END)`
      )
      .join(" + ");
    const skillMatchQuery = `(${subQueries})`;

    let query = connection.manager
      .createQueryBuilder(Listing, "listing")
      .leftJoin(
        AutoApply,
        "autoApply",
        "autoApply.listingId = listing.id AND autoApply.userId = :userId",
        { userId: user.id }
      )
      .addSelect(skillMatchQuery, "matchCount")
      .where("listing.maxSalary >= :minSalary", { minSalary })
      .andWhere("autoApply.id IS NULL")
      .andWhere("listing.directApplyFlag = TRUE")
      .andWhere("listing.closedFlag = FALSE")
      .orderBy("listing.datePosted", "DESC")
      .take(limit || 10);

    if (remote) {
      query = query.andWhere("listing.remoteFlag = TRUE");
    }

    if (matchSkills) {
      query = query.andWhere(
        `${skillMatchQuery} >= :calculatedRequiredMatches`,
        { calculatedRequiredMatches }
      );
    }

    const listings = await query.getRawMany();

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update the closed_flag of a listing to true.
 * @param {Request} req - Express request object containing the ID of the listing to be closed.
 * @param {Response} res - Express response object for sending the updated listing.
 */
export async function closeListing(req: Request, res: Response) {
  try {
    const listingId = req.params._id;
    const connection = await getConnection();

    const listingToUpdate = await connection.manager.findOne(Listing, {
      where: { id: Number(listingId) },
    });

    if (!listingToUpdate) {
      throw new Error(`Listing with ID ${listingId} not found.`);
    }

    listingToUpdate.closedFlag = true;
    const updatedListing = await connection.manager.save(listingToUpdate);
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const listingController = {
  closeListing,
  createListing,
  getUnappliedListing,
  getListing,
  getListingById,
};
export default listingController;
