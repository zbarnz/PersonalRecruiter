// src/test/jest/global-setup.ts
import { logger } from "../../../lib/logger/pino.config";
import { startServer } from "../utils/client";
import { clean } from "../utils/db";

export default async () => {
  logger.info("test server starting...");

  await startServer();
  await clean();
};
