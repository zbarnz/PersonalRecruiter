import { DataSource } from "typeorm";
import { getConnection } from "../../../../data-source";

import { User } from "../../../entity";
import { createFakeUser } from "../../fakes/user";
import { client, startServer, stopServer } from "../../utils/client";
import { clean } from "../../utils/db";

describe("userController", () => {
  let connection: DataSource;
  let existingUser: User;

  beforeAll(async () => {
    await startServer();
    await clean();
    connection = await getConnection();
  });

  afterEach(async () => {
    await clean(["User"]);
  });

  afterAll(async () => {
    await clean();
    await stopServer();
  });

  describe("createUser", () => {
    it("should create a new user and return it", async () => {
      const user: User = createFakeUser();

      const res = await client.post("/user/create", user);

      const userResponse = new User();
      Object.assign(userResponse, {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
      });

      existingUser = userResponse;

      expect(userResponse).toBeInstanceOf(User);
      expect(userResponse.email).toEqual(user.email);
      expect(userResponse.phone).toEqual(user.phone);
    });

    it("should not create user without phone number", async () => {
      const user = createFakeUser();

      const res = await client.post("/user/create", { ...user, phone: null });

      expect(res.status).toEqual(400);
    });
  });

  describe("getUser", () => {
    it("should return the user if found", async () => {
      const user: User = createFakeUser();

      const res = await client.get(`/user/${existingUser.id}`);

      const userResponse = new User();
      Object.assign(userResponse, {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
      });

      expect(res.status).toEqual(200);
      expect(userResponse).toEqual(existingUser);
    });

    it("should return 404 if user not found", async () => {
      const res = await client.get(`/user/404`);

      expect(res.status).toEqual(404);
    });
  });
});
