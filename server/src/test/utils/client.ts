import axios from "axios";

import { start, close } from "../../../lib/utils/express";

import { logger } from "../../../lib/logger/pino.config";

const client = axios.create({
  baseURL: "http://localhost:4001/api",
});

// Add a response interceptor for error visibility
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error("Error data: " + JSON.stringify(error.response.data));
    } else if (error.request) {
      logger.error("Error request:", JSON.stringify(error.request));
    } else {
      logger.error("Unexpected Error:", JSON.stringify(error.message));
    }
    return Promise.reject(error);
  }
);

export { client, start as startServer, close as stopServer };