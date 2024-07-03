import { DataSource } from "typeorm";
import { getConnection } from "../../../../data-source";

import { JobBoard, Listing, User } from "../../../entity";

import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";
import { createFakeUser } from "../../fakes/user";
import { client } from "../../utils/client";

describe("exceptionController", () => {
  let connection: DataSource;
  let user1: User = new User();
  let listing1: Listing;
  let jobBoard1: JobBoard;

  beforeAll(async () => {
    //await clean();

    connection = await getConnection();

    const jobBoardEntity1 = createFakeJobBoard();
    const createdJobBoard = connection.manager.create(
      JobBoard,
      jobBoardEntity1
    );
    jobBoard1 = await connection.manager.save(createdJobBoard);

    const listingEntity1 = createFakeListing(jobBoard1);
    const createdListing = connection.manager.create(Listing, listingEntity1);
    listing1 = await connection.manager.save(createdListing);

    const { user, password } = createFakeUser(true);

    const res = await client.post("/user/register", {
      phone: user.phone,
      email: user.email,
      password,
    });

    client.defaults.headers.common["Authorization"] = res.data.jwt.token;
    Object.assign(user1, res.data.user);
  });

  // afterAll(async () => {
  //   await clean();
  // });

  describe("createException", () => {
    it("should create a new exception", async () => {
      const reason = "Nahhhh bruhhhh";
      const res = await client.post("/exception/create", {
        listing: listing1,
        user: user1,
        reason,
      });

      expect(res.status).toEqual(200);
      expect(res.data.user.email).toEqual(user1.email);
      expect(res.data.user.id).toEqual(user1.id);
      expect(res.data.user.points).toEqual(user1.points);

      expect(res.data.listing.id).toEqual(listing1.id);
      expect(res.data.reason).toEqual(reason);
    });
  });
});
