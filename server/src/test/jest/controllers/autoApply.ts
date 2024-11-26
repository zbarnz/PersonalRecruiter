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

import { client } from "../../utils/client";

import { getConnection } from "../../../../data-source";
import { createFakeJobBoard } from "../../fakes/jobBoard";
import { createFakeListing } from "../../fakes/listing";
import { createFakeUserApplicantConfig } from "../../fakes/userApplicantConfig";

describe("autoApplyController", () => {
  let user1: User = new User();
  let user1Config: UserApplicantConfig;
  let listing1: Listing;
  let jobBoard1: JobBoard;
  let connection: DataSource;
  let currentUser = new User();

  jest.setTimeout(60000);

  beforeAll(async () => {
    //await clean();

    connection = await getConnection();

    const jobBoardEntity1 = createFakeJobBoard();
    const createdJobBoard = connection.manager.create(
      JobBoard,
      jobBoardEntity1
    );
    jobBoard1 = await connection.manager.save(createdJobBoard);

    const { user: userEntity1 } = createFakeUser(false);
    const createdUser = connection.manager.create(User, userEntity1);
    const {
      salt: newSalt,
      hash: newHash,
      ...savedUser
    } = await connection.manager.save(createdUser);
    Object.assign(user1, savedUser);

    const listingEntity1 = createFakeListing(jobBoard1);
    const createdListing = connection.manager.create(Listing, listingEntity1);
    listing1 = await connection.manager.save(createdListing);

    const userApplicantConfigEnitity1 = createFakeUserApplicantConfig(user1);
    const createdApplicantConfig = connection.manager.create(
      UserApplicantConfig,
      userApplicantConfigEnitity1
    );
    user1Config = await connection.manager.save(createdApplicantConfig);

    const { user, password } = createFakeUser(true);

    const res = await client.post("/user/register", {
      email: user.email,
      phone: user.phone,
      password,
    });
    Object.assign(currentUser, res.data.user);
    client.defaults.headers.common["Authorization"] = res.data.jwt.token;
  });

  // beforeEach(async () => {
  //   await clean(["User", "Listing", "JobBoard", "userApplicantConfig"]);
  // });

  describe("createAutoApply", () => {
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

  describe.only("getApplysForUser", () => {
    beforeAll(async () => {
      // Create AutoApply records
      for (let i = 0; i < 15; i++) {
        let savedListing: Listing;
        const listingEntity = createFakeListing(jobBoard1);
        const createdListing = connection.manager.create(
          Listing,
          listingEntity
        );
        savedListing = await connection.manager.save(createdListing);

        const autoApplyEntity = createFakeAutoApply(currentUser, savedListing);
        const createdAutoApply = connection.manager.create(
          AutoApply,
          autoApplyEntity
        );
        await connection.manager.save(createdAutoApply);
      }
    });

    it("should retrieve paginated autoapply records for a user", async () => {
      const body = {
        page: 1,
        pageSize: 5,
      };

      const res: AxiosResponse = await client.post(`/autoapply/`, body);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("data");
      expect(res.data).toHaveProperty("pagination");
      expect(res.data.pagination.page).toBe(body.page);
      expect(res.data.pagination.pageSize).toBe(body.pageSize);
      expect(res.data.pagination.total).toBeGreaterThanOrEqual(15);
      expect(res.data.data.length).toBeLessThanOrEqual(body.pageSize);

      res.data.data.forEach((autoApply: AutoApply) => {
        expect(autoApply).toHaveProperty("user");
        expect(autoApply.user.id).toBe(currentUser.id);
        expect(autoApply).toHaveProperty("listing");
        expect(autoApply.listing).toHaveProperty("jobBoard");
      });
    });

    it("should return an empty array if no records exist for the page", async () => {
      const body = {
        page: 4, // Assuming there are less than 40 records.
        pageSize: 10,
      };

      const res: AxiosResponse = await client.post(`/autoapply/`, body);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("data");
      expect(res.data.data).toEqual([]);
      expect(res.data.pagination.page).toBe(body.page);
      expect(res.data.pagination.totalPages).toBeGreaterThanOrEqual(1);
    });

    it("should order the results correctly based on the orderBy column and orderDirection", async () => {
      const body = {
        page: 1,
        pageSize: 5,
        orderBy: "dateApplied",
        orderDirection: "ASC",
      };

      const res: AxiosResponse = await client.post(`/autoapply/`, body);

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty("data");
      expect(res.data.data.length).toBeGreaterThan(0);

      const dates = res.data.data.map((autoApply: AutoApply) =>
        new Date(autoApply.dateApplied).getTime()
      );

      // Check if the dates are sorted in ascending order
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1]);
      }
    });

    it("should return an error if an invalid orderBy column is provided", async () => {
      const body = {
        page: 1,
        pageSize: 5,
        orderBy: "nonExistentColumn",
      };

      const res: AxiosResponse = await client.post(`/autoapply/`, body, {
        validateStatus: () => true, // Allows validation of non-200 responses
      });

      expect(res.status).toBe(400);
      expect(res.data).toHaveProperty("error");
    });
  });
});
