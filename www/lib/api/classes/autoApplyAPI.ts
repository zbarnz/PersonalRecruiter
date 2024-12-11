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
 * @param payload - parameters for fetching applications
 * @returns - the user and token
 */
async getApplications(payload: {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
  filters?: Record<string, any>;
}): Promise<{
  autoApply: AutoApply[];
} | null> {
  try {
    const res = await client.post("/autoapply/", {
      page: payload.page,
      pageSize: payload.pageSize,
      orderBy: payload.orderBy,
      orderDirection: payload.orderDirection,
      ...payload.filters, // Spread additional filters into the request body
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
