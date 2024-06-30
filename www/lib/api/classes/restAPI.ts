import client from "../client";

import { notifications } from "@mantine/notifications";

class RestAPI {
  type: string;
  /**
   * Create an instance of the RestAPI which includes crud operational methods
   * for a given type/controller. By default there are `get`, `create`,
   * `update`, and `destroy`. Others can be included in the constructor.
   *
   * @param type - rest type (e.g. takeaway, meeting, topic)
   *
   */
  constructor(type: string) {
    this.type = type;
  }

  /**
   * Get a specific object by id (handles errors with notification)
   *
   * @param id - id of object to retrieve
   *
   * @returns {Promise<Object|undefined>} - retrieved object
   */
  async get(id: string): Promise<Object | null> {
    try {
      const res = await client.get(`${this.type}/${id}`);

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to get ${this.type} (${err.message} )`,
        color: "red",
      });

      return null;
    }
  }

  /**
   * Create a object (handles errors with notifications)
   *
   * @param {Object} payload - object to create
   *
   * @returns {Promise<Object|null>} - created object
   */
  async create(payload: Object): Promise<Object | null> {
    try {
      const res = await client.post(this.type, payload);

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to create ${this.type} (${err.message} )`,
        color: "red",
      });

      return null;
    }
  }

  /**
   * Update an object (handles errors with notifications)
   *
   * @param  id - id of object to update
   * @param payload  - updates to object
   *
   * @returns  - updated object
   */
  async update(id: string, payload: Object): Promise<Object | null> {
    try {
      const res = await client.patch(`${this.type}/${id}`, payload);

      return res.data;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to update ${this.type} (${err.message} )`,
        color: "red",
      });

      return null;
    }
  }

  /**
   * Delete a object (handles errors with notifications)
   *
   * @param  id - id of object to delete
   *
   */
  async destroy(id: string): Promise<string | null> {
    try {
      await client.delete(`${this.type}/${id}`);

      return id;
    } catch (err) {
      if (!(err instanceof Error)) {
        return null;
      }
      notifications.show({
        message: `Failed to delete ${this.type} (${err.message} )`,
        color: "red",
      });

      return null;
    }
  }
}

export default RestAPI;
