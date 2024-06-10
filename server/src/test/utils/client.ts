import axios from "axios";

import { close, start } from "../../../lib/utils/express";

import { logger } from "../../../lib/logger/pino.config";

const client = axios.create({
  baseURL: "http://localhost:4001/api",
  validateStatus: (status) => status !== 500,
});

// Add a response interceptor for error visibility
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error("Error data: ", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      logger.error("Error request:", error.request.data);
      return Promise.reject(error.request.data);
    } else {
      logger.error("Unexpected Error:", error.message);
      return Promise.reject(error.message);
    }
  }
);

export { client, start as startServer, close as stopServer };
