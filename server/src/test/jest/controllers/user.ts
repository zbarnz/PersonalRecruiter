import { DataSource } from "typeorm";
import { getConnection } from "../../../../data-source";

import { User } from "../../../entity";
import { createFakeUser } from "../../fakes/user";
import { client, startServer, stopServer } from "../../utils/client";
import { clean } from "../../utils/db";

describe("userController", () => {
  let connection: DataSource;
  let existingUser: User = new User();
  let existingUserPassword: string;

  beforeAll(async () => {
    await startServer();
    await clean();
    connection = await getConnection();

    const { user: userEntity1, password: userPassword1 } =
      createFakeUser(false);
    const createdUser = connection.manager.create(User, userEntity1);
    const {
      salt: newSalt,
      hash: newHash,
      ...savedUser
    } = await connection.manager.save(createdUser);
    Object.assign(existingUser, savedUser);
    existingUserPassword = userPassword1;
  });

  afterEach(async () => {
    await clean(["User"]);
  });

  afterAll(async () => {
    await clean();
    await stopServer();
  });

  describe("registerUser", () => {
    it("should register a new user and return it", async () => {
      const { user, password } = createFakeUser(true) as {
        user: User;
        password: string;
      };

      const res = await client.post("/user/register", { user, password });

      const userResponse = new User();
      Object.assign(userResponse, {
        ...res.data.user,
        createdAt: new Date(res.data.createdAt),
      });

      expect(userResponse).toBeInstanceOf(User);
      expect(userResponse.email).toEqual(user.email);
      expect(userResponse.phone).toEqual(user.phone);
    });

    it("should not register user without phone number", async () => {
      const { user, password } = createFakeUser(true) as {
        user: User;
        password: string;
      };

      const res = await client.post("/user/register", {
        user: { ...user, phone: null },
        password,
      });

      expect(res.status).toEqual(400);
    });

    it("should not register user without email", async () => {
      const { user, password } = createFakeUser(true) as {
        user: User;
        password: string;
      };

      const res = await client.post("/user/register", {
        user: { ...user, email: null },
        password,
      });
      expect(res.status).toEqual(400);
    });

    it("should not register user with an already registered email", async () => {
      const res = await client.post("/user/register", {
        user: existingUser,
        password: "SecureP@ssword12",
      });

      expect(res.status).toEqual(409);
    });
  });

  describe("loginUser", () => {
    it("should login an existing user", async () => {
      const res = await client.post("/user/login", {
        email: existingUser.email,
        password: existingUserPassword,
      });

      expect(res.status).toEqual(200);
      expect(existingUser.email).toEqual(res.data.user.email);
      expect(existingUser.points).toEqual(0);
      expect(existingUser.phone).toEqual(res.data.user.phone);
    });

    it("should not login an existing user with invalid password", async () => {
      const res = await client.post("/user/login", {
        email: existingUser.email,
        password: existingUserPassword + "!",
      });

      expect(res.status).toEqual(401);
    });
  });

  // describe.skip("getUser", () => { //removed get user route.
  //   it("should return the user if found", async () => {
  //     const { user } = createFakeUser(true) as {
  //       user: User;
  //     };

  //     const res = await client.get(`/user/${existingUser.id}`);

  //     const userResponse = new User();
  //     Object.assign(userResponse, {
  //       ...res.data,
  //       createdAt: new Date(res.data.createdAt),
  //     });

  //     expect(res.status).toEqual(200);
  //     expect(userResponse).toEqual(existingUser);
  //   });

  //   it("should return 404 if user not found", async () => {
  //     const res = await client.get(`/user/404`);

  //     expect(res.status).toEqual(404);
  //   });
  // });
});
