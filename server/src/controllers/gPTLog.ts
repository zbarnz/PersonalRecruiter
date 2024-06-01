// Assume that GPTLog is in the same directory level as AutoApply
import { GPTLog } from "../entity/GPTLog";
import { getConnection } from "../../data-source";
import { DataSource, UpdateResult } from "typeorm";

import { Request, Response } from "express";

//helpers

export const createGPTLogHelper = async (g: GPTLog): Promise<GPTLog> => {
  try {
    const connection: DataSource = await getConnection();
    const savedGPTLog = await connection.manager.save(g);
    return savedGPTLog;
  } catch (error) {
    console.error("Error saving GPTLog:", error);
    throw new Error("Failed to save GPTLog");
  }
};

export const setGPTLogAsFailedHelper = async (
  id: GPTLog["id"]
): Promise<GPTLog> => {
  const connection = await getConnection();

  let gptLog = await connection.manager.findOne(GPTLog, {
    where: { id: Number(id) },
  });

  if (!gptLog) {
    return null;
  }

  gptLog.failedFlag = true;
  gptLog = await connection.manager.save(gptLog);

  return gptLog;
};

export const setGPTLogBatchAsFailedHelper = async (
  batchId: GPTLog["batchId"]
): Promise<UpdateResult> => {
  const connection = await getConnection();

  const updatedLogs = await connection
    .createQueryBuilder()
    .update(GPTLog)
    .set({ failedFlag: true })
    .where("batchId = :batchId", { batchId })
    .execute();

  return updatedLogs;
};

//route controllers

export const createGPTLog = async (req: Request, res: Response) => {
  try {
    const gptLog: GPTLog = req.body; // Assuming GPTLog comes from the request body
    const savedLog: GPTLog = await createGPTLogHelper(gptLog);
    res.json(savedLog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getGPTLog = async (req: Request, res: Response) => {
  try {
    const gptLogId = req.params._id; // Assuming ID comes from URL parameters
    const connection = await getConnection();
    const gptLog = await connection.manager.findOne(GPTLog, {
      where: { id: Number(gptLogId) },
    });

    if (!gptLog) {
      return res.status(404).json({ error: "GPTLog not found." });
    }

    res.json(gptLog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const setGPTLogAsFailed = async (req: Request, res: Response) => {
  try {
    const gptLogId: GPTLog["id"] = Number(req.params._id); // Assuming ID comes from URL parameters

    const gptLog: GPTLog = await setGPTLogAsFailedHelper(gptLogId);

    if (!gptLog) {
      res.status(404).json({ error: `GPTLog with ID ${gptLogId} not found.` });
    }

    res.json(gptLog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const gptLogController = { setGPTLogAsFailed, getGPTLog, createGPTLog };
export default gptLogController;
