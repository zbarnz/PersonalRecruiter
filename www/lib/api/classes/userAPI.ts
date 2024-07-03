import { notifications } from "@mantine/notifications";
import { User } from "../../../src/entity";
import client from "../client";
import RestAPI from "./restAPI";

class UserAPI extends RestAPI {
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
    email: string;
    phone?: string;
    password: string;
  }): Promise<User | null> {
    try {
      const res = await client.post("/user/register", {
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
      });

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to register user (${err.message})`,
        color: "red",
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
        message: `Failed to login User (${err.message})`,
        color: "red",
      });

      return null;
    }
  }

  /**
   * Refresh a user
   * @param payload - email and password
   * @returns - user + token
   */
  async refresh(): Promise<User | null> {
    try {
      const res = await client.get("/user/refresh");

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to refresh user (${err.message})`,
        type: "danger",
      });

      return null;
    }
  }
}

export default UserAPI;
