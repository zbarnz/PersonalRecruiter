import { DataSource } from "typeorm";
import { getConnection } from "../../../../data-source";

import { JobBoard, Listing, User } from "../../../entity";

import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";
import { createFakeUser } from "../../fakes/user";
import { client, startServer, stopServer } from "../../utils/client";
import { clean } from "../../utils/db";

describe("exceptionController", () => {
  let connection: DataSource;
  let user1: User;
  let listing1: Listing;
  let jobBoard1: JobBoard;

  beforeAll(async () => {
    await startServer();
    await clean();
    connection = await getConnection();

    const jobBoardEntity1 = createFakeJobBoard();
    const createdJobBoard = connection.manager.create(
      JobBoard,
      jobBoardEntity1
    );
    jobBoard1 = await connection.manager.save(createdJobBoard);

    const userEntity1 = await createFakeUser();
    const createdUser = connection.manager.create(User, userEntity1);
    user1 = await connection.manager.save(createdUser);

    const listingEntity1 = createFakeListing(jobBoard1);
    const createdListing = connection.manager.create(Listing, listingEntity1);
    listing1 = await connection.manager.save(createdListing);
  });

  afterAll(async () => {
    await clean();
    await stopServer();
  });

  describe("createException", () => {
    it("should create a new exception", async () => {
      const reason = "Nahhhh bruhhhh";
      const res = await client.post("/exception/create", {
        listing: listing1,
        user: user1,
        reason,
      });

      const userResponse = new User();
      const listingResponse = new Listing();
      const listingResponseJB = new JobBoard();
      Object.assign(userResponse, {
        ...res.data.user,
        createdAt: new Date(res.data.user.createdAt),
      });
      Object.assign(listingResponseJB, jobBoard1);
      Object.assign(listingResponse, {
        ...res.data.listing,
        datePosted: new Date(res.data.listing.datePosted),
        dateUpdated: new Date(res.data.listing.dateUpdated),
        jobBoard: listingResponseJB,
      });

      expect(res.status).toEqual(200);
      expect(userResponse).toEqual(user1);
      expect(listingResponse).toEqual(listing1);
      expect(res.data.reason).toEqual(reason);
    });
  });
});
