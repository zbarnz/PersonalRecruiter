// Assume that GPTLog is in the same directory level as AutoApply
import { GPTLog } from "../entity/GPTLog";
import { getConnection } from "../data-source";

import { Request, Response } from "express";

export const createGPTLog = async (req: Request, res: Response) => {
  try {
    const gptLog = req.body; // Assuming GPTLog comes from the request body
    const connection = await getConnection();
    const savedLog = await connection.manager.save(gptLog);
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
    const gptLogId = req.params._id; // Assuming ID comes from URL parameters
    const connection = await getConnection();

    let gptLog = await connection.manager.findOne(GPTLog, {
      where: { id: Number(gptLogId) },
    });

    if (!gptLog) {
      return res
        .status(404)
        .json({ error: `GPTLog with ID ${gptLogId} not found.` });
    }

    gptLog.failedFlag = true;
    gptLog = await connection.manager.save(gptLog);

    res.json(gptLog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const gptLogController = { setGPTLogAsFailed, getGPTLog, createGPTLog };
export default gptLogController;
