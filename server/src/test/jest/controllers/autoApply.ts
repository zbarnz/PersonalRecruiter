import { clean } from "../../utils/db";

import { createFakeAutoApply } from "../../fakes/autoApply";
import { createFakeUser } from "../../fakes/user";

import { AutoApply, JobBoard, Listing, User } from "../../../entity";

import { AxiosResponse } from "axios";

import { client, startServer, stopServer } from "../../utils/client";

import { getConnection } from "../../../../data-source";
import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";

describe("getApplyResources", () => {
  let user1: User;
  let listing1: Listing;
  let jobBoard1: JobBoard;

  beforeAll(async () => {
    await startServer();
    await clean();
    const connection = await getConnection();

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

  beforeEach(async () => {
    await clean(["User", "Listing", "JobBoard"]);
  });

  afterAll(async () => {
    await clean();
    await stopServer();
  });

  it("should create autoapply record for user", async () => {
    const autoApplyEntity: AutoApply = createFakeAutoApply(user1, listing1);

    const res: AxiosResponse = await client.post("/autoapply/create", {
      autoApply: autoApplyEntity,
      getCoverLetter: false,
      getResume: false,
      questions: null,
    });

    const autoApplyResponse = new AutoApply();
    const userResponse = new User();
    const listingResponse = new Listing();
    Object.assign(autoApplyResponse, res.data.autoApply);
    Object.assign(userResponse, res.data.autoApply.user);
    Object.assign(listingResponse, res.data.autoApply.listing);

    expect(res.status).toBe(200);
    expect(autoApplyResponse).toBeInstanceOf(AutoApply);
    expect(userResponse).toBeInstanceOf(User);
    expect(listingResponse).toBeInstanceOf(Listing);
    expect(autoApplyResponse.user).toEqual(user1);
    expect(autoApplyResponse.listing).toEqual(listing1);
  });

  it("should not create a duplicate autoapply per user per listing", async () => {
    const autoApplyEntity1: AutoApply = createFakeAutoApply(user1, listing1);

    const res1: AxiosResponse = await client.post("/autoapply/create", {
      autoApply: autoApplyEntity1,
      getCoverLetter: false,
      getResume: false,
      questions: null,
    });

    const autoApplyEntity2: AutoApply = createFakeAutoApply(user1, listing1);

    const res2: AxiosResponse = await client.post("/autoapply/create", {
      autoApply: autoApplyEntity2,
      getCoverLetter: false,
      getResume: false,
      questions: null,
    });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res1.data.autoApply).toStrictEqual(res2.data.autoApply);
  });

  it("should return documents successfully", async () => {});
});
