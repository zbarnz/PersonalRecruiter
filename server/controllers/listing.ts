import { Listing } from "../../src/entity/Listing";
import { getConnection } from "../../src/data-source";

import { User } from "../../src/entity/User";
import { AutoApply } from "../../src/entity/AutoApply";

//import { utcToUnix } from "../../../src/utils/date";

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

/**
 * basic create function. NO UPDATES ALLOWED
 * @param {Listing}  listing - A valid listing object
 * @returns {Promise<Listing[]>} created listing
 */
export async function createListing(listing: Listing) {
  const connection = await getConnection();
  return await connection.manager.save(listing);
}

/**
 * basic get function.
 * @param {Listing["jobListingId"]}  jobListingId - A job listing job board id
 * @param {Listing["jobBoardId"]}  jobBoardId - A job Board's id
 * @returns {Promise<Listing[]>} Found listing
 */
export async function getListing(
  jobListingId: Listing["jobListingId"],
  jobBoardId: Listing["jobBoardId"]
): Promise<Listing> {
  const connection = await getConnection();

  const listing: Listing = await connection.manager //findOne was producing inefficient queries
    .createQueryBuilder(Listing, "listing")
    .select("listing.jobListingId")
    .where("listing.jobListingId = :jobListingId", { jobListingId })
    .andWhere("listing.jobBoardId = :jobBoardId", { jobBoardId })
    .getOne();

  return listing;
}

export async function getListingById(id: Listing["id"]) {
  const connection = await getConnection();

  const listing: Listing = await connection.manager.findOne(Listing, {
    where: { id },
  });

  return listing;
}

/**
 * This function finds listings in the database that have not been applied to b
 * @param {User} user - The user applying
 * @param {number}  minSalary - A Listing's minimum maxSalary value
 * @param {boolean} remote - find only remote jobs?
 * @param {string[]} [skills] - List of user's skills
 * @param {boolean} [matchSkills] - Only find jobs that are a skills match
 * @param {number} requiredMatches number of skills Listing must contain
 * @returns {Promise<Listing[]>} Unapplied listings that matches user's preferences
 */
export async function findUnappliedListing(
  user: User,
  minSalary?: number,
  remote?: boolean,
  skills?: string[],
  matchSkills?: boolean,
  requiredMatches?: number,
  limit?: number
): Promise<Listing[]> {
  const connection = await getConnection();
  const userId = user.id;

  if (!requiredMatches) {
    requiredMatches = Math.ceil(skills.length * 0.1); //listing must match 10% of skills
  }

  let subQueries = skills
    .map(
      (skill) =>
        `(CASE WHEN lower(listing.description) ILIKE '%${skill}%' THEN 1 ELSE 0 END)`
    )
    .join(" + ");

  // This subquery calculates the number of skills matches for each listing
  const skillMatchQuery = `(${subQueries})`;

  let query = connection.manager
    .createQueryBuilder(Listing, "listing")
    .leftJoin(
      AutoApply,
      "autoApply",
      "autoApply.listing = listing.id AND autoApply.user = :userId",
      { userId }
    )
    .addSelect(skillMatchQuery, "matchCount")
    .where("listing.maxSalary >= :minSalary", { minSalary }) //max sure the listing max salary is higher than the users min acceptable salary
    .andWhere("autoApply.id IS NULL")
    .andWhere("listing.directApplyFlag")
    .andWhere("listing.closedFlag = false")
    .orderBy("listing.datePosted", "DESC")
    .take(limit || 1);

  if (remote) {
    query = query.andWhere("listing.remoteFlag = TRUE");
  }

  if (matchSkills) {
    query = query.andWhere(`${skillMatchQuery} >= :requiredMatches`, {
      requiredMatches,
    });
  }

  let listings = await query.getRawAndEntities();

  // Calculate and add percentage match for each listing
  listings.entities = listings.entities.map((entity, index) => {
    const raw = listings.raw[index];
    entity["numberMatch"] = raw.matchCount + "/" + skills.length;
    return entity;
  });

  return listings.entities;
}

async function upsertMonthOld(listing: Listing) {
  const connection = await getConnection();

  if (listing.id && listing.datePosted < THIRTY_DAYS_IN_MILLISECONDS) {
    return null;
  }

  return connection.manager.upsert(Listing, listing, Array(listing.id));
}

/**
 * Update the closed_flag of a listing to true.
 * @param {number} listingId - ID of the listing to be closed.
 * @returns {Promise<Listing>} Updated listing with closedFlag set to true.
 * @throws {Error} If the listing is not found.
 */
export async function closeListing(listingId: number): Promise<Listing> {
  const connection = await getConnection();

  const listingToUpdate = await connection.manager.findOne(Listing, {
    where: {
      id: listingId,
    },
  });

  if (!listingToUpdate) {
    throw new Error(`Listing with ID ${listingId} not found.`);
  }

  listingToUpdate.closedFlag = true;
  return await connection.manager.save(Listing, listingToUpdate);
}
