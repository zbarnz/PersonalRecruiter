import { DataSource } from "typeorm";
import { getConnection } from "../../../../data-source";

import { JobBoard, Listing, User } from "../../../entity";

import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";
import { createFakeUser } from "../../fakes/user";
import { client, startServer, stopServer } from "../../utils/client";
import { clean } from "../../utils/db";

describe("listingController", () => {
  let connection: DataSource;
  let jobBoard1: JobBoard;
  let user1: User = new User();

  jest.setTimeout(60000);

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

    const { user, password } = createFakeUser(true);

    const res = await client.post("/user/register", { user, password });

    client.defaults.headers.common["Authorization"] = res.data.jwt.token;
  });

  afterAll(async () => {
    await clean();
    await stopServer();
  });

  describe("createListing", () => {
    it("should create a new listing", async () => {
      const listing: Listing = createFakeListing(jobBoard1);

      const res = await client.post("/listing/create", { listing });

      const listingResponseJB = new JobBoard();
      Object.assign(listingResponseJB, res.data.jobBoard);

      expect(res.data).toHaveProperty("datePosted");
      expect(res.data).toHaveProperty("dateUpdated");
      expect(res.data).toHaveProperty("id");

      expect(res.data.title).toEqual(listing.title);
      expect(res.data.description).toEqual(listing.description);
      expect(res.data.jobBoard.id).toEqual(listing.jobBoard.id);

      expect(listingResponseJB).toEqual(jobBoard1);
    });

    it.skip("should convert salaries approperiatly", async () => {
      //sometimes salaries on job websites are placeholder values / need to figure out the exact rules for this
    });
  });
});
