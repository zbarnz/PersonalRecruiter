import { notifications } from "@mantine/notifications";
import { User } from "../../src/entity";
import client from "../client";
import RestAPI from "./restAPI";

class userAPI extends RestAPI {
  /**
   * Create an instance of userAPI
   *
   */
  constructor() {
    super("user");
  }

  /**
   * Register a user
   * @param payload - credentials for registration
   * @returns  - the user and token
   */
  async register(payload: {
    user: User;
    password: string;
  }): Promise<User | null> {
    try {
      const res = await client.post("/user/register", {
        user: payload.user,
        password: payload.password,
      });

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to get takeaways for topic (${err.message})`,
        type: "danger",
      });

      return null;
    }
  }

  /**
   * Login a user
   * @param payload - email and password
   * @returns - user + token
   */
  async login(payload: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const res = await client.post("/user/login", {
        email: payload.email,
        password: payload.password,
      });

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to get action items for topic (${err.message})`,
        type: "danger",
      });

      return null;
    }
  }

  /**
   * Login a user
   * @param payload - email and password
   * @returns - user + token
   */
  async refresh(): Promise<User | null> {
    try {
      const res = await client.get("/user/refresh")

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to get action items for topic (${err.message})`,
        type: "danger",
      });

      return null;
    }
  }
}

export default userAPI;
