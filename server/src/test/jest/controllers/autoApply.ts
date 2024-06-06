import { clean } from "../../utils/db";

import { createFakeAutoApply } from "../../fakes/autoApply";
import { createFakeUser } from "../../fakes/user";

import fs from "fs/promises";

import {
  AutoApply,
  JobBoard,
  Listing,
  User,
  UserApplicantConfig,
} from "../../../entity";

import { AxiosResponse } from "axios";

import { DataSource } from "typeorm";

import { client, startServer, stopServer } from "../../utils/client";

import { getConnection } from "../../../../data-source";
import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";
import { createFakeUserApplicantConfig } from "../../fakes/userApplicantConfig";

describe("getApplyResources", () => {
  let user1: User;
  let user1Config: UserApplicantConfig;
  let listing1: Listing;
  let jobBoard1: JobBoard;
  let connection: DataSource;

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

    const userEntity1 = await createFakeUser();
    const createdUser = connection.manager.create(User, userEntity1);
    user1 = await connection.manager.save(createdUser);

    const listingEntity1 = createFakeListing(jobBoard1);
    const createdListing = connection.manager.create(Listing, listingEntity1);
    listing1 = await connection.manager.save(createdListing);

    const userApplicantConfigEnitity1 = createFakeUserApplicantConfig(user1);
    const createdApplicantConfig = connection.manager.create(
      UserApplicantConfig,
      userApplicantConfigEnitity1
    );
    user1Config = await connection.manager.save(createdApplicantConfig);
  });

  beforeEach(async () => {
    await clean(["User", "Listing", "JobBoard", "userApplicantConfig"]);
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
    const listingResponseJB = new JobBoard();
    Object.assign(autoApplyResponse, res.data.autoApply);
    Object.assign(userResponse, {
      ...res.data.autoApply.user,
      createdAt: new Date(res.data.autoApply.user.createdAt),
    });
    Object.assign(listingResponseJB, res.data.autoApply.listing.jobBoard);
    Object.assign(listingResponse, {
      ...res.data.autoApply.listing,
      datePosted: new Date(res.data.autoApply.listing.datePosted),
      dateUpdated: new Date(res.data.autoApply.listing.dateUpdated),
      jobBoard: listingResponseJB,
    });

    expect(res.status).toBe(200);
    expect(autoApplyResponse).toBeInstanceOf(AutoApply);
    expect(userResponse).toBeInstanceOf(User);
    expect(listingResponse).toBeInstanceOf(Listing);
    expect(userResponse).toStrictEqual(user1);
    expect(listingResponse).toStrictEqual(listing1);
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

  it("should return documents successfully", async () => {
    const autoApplyEntity: AutoApply = createFakeAutoApply(user1, listing1);

    const res: AxiosResponse = await client.post("/autoapply/create", {
      autoApply: autoApplyEntity,
      getCoverLetter: true,
      getResume: true,
      questions: null,
    });

    const autoApplyResponse = new AutoApply();
    Object.assign(autoApplyResponse, res.data.autoApply);

    console.log(res.data.documents.coverLetter.buffer.data);

    const resumeBuffer = Buffer.from(res.data.documents.resume.data);
    const coverLetterBuffer = Buffer.from(
      res.data.documents.coverLetter.buffer.data
    );

    expect(res.status).toBe(200);
    expect(autoApplyResponse).toBeInstanceOf(AutoApply);
    expect(res.data.documents).toBeInstanceOf(Object);
    expect(resumeBuffer).toBeInstanceOf(Buffer);
    expect(coverLetterBuffer).toBeInstanceOf(Buffer);
    await fs.writeFile(
      "./src/test/jest/output_files/resumeOutput.pdf",
      resumeBuffer
    );
    await fs.writeFile(
      "./src/test/jest/output_files/coverLetterOutput.pdf",
      coverLetterBuffer
    );
  });
});
