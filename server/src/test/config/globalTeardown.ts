// src/test/jest/global-teardown.ts
import { logger } from "../../../lib/logger/pino.config";
import { stopServer } from "../utils/client";
import { clean } from "../utils/db";

export default async () => {
  logger.info("Test server stopping...");

  await clean();
  await stopServer();
};
