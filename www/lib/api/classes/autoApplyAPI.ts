import { notifications } from "@mantine/notifications";
import { AutoApply } from "../../../src/entity";
import client from "../client";
import RestAPI from "./restAPI";

class autoApplyAPI extends RestAPI {
  /**
   * Create an instance of userAPI
   *
   */
  constructor() {
    super("autoapply");
  }

  /**
   * Get Autoapply records for subject
   * @param payload - credentials for registration
   * @returns  - the user and token
   */
  async getApplications(payload: { page: number; pageSize: number }): Promise<{
    autoApply: AutoApply[];
  } | null> {
    try {
      const res = await client.post("/autoapply/", {
        params: { page: payload.page, pageSize: payload.pageSize },
      });

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to get apply records (${err.message})`,
        color: "red",
      });

      return null;
    }
  }
}

export default autoApplyAPI;
