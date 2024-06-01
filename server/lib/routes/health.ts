import express from "express";

import { logger } from "../../lib/logger/pino.config";

export const router = express.Router();

router.get("/", (req, res) => {
  logger.info("health check");
  res.status(200).json({ status: "UP" });
});
