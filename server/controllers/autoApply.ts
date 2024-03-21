import { AutoApply } from "../entity/AutoApply";
import { getConnection } from "../data-source";

import { Request, Response } from "express";

export const createApply = async (req: Request, res: Response) => {
  try {
    const autoApply = req.body;
    const connection = await getConnection();
    const savedApply = await connection.manager.save(autoApply);
    res.json(savedApply);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getApply = async (req: Request, res: Response) => {
  try {
    const autoApplyId = req.params._id; // Assuming ID comes from URL parameters
    const connection = await getConnection();
    const autoApply = await connection.manager.findOne(AutoApply, {
      where: { id: Number(autoApplyId) },
    });

    if (!autoApply) {
      return res.status(404).json({ error: "AutoApply not found." });
    }

    res.json(autoApply);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const autoApplyController = { getApply, createApply };
export default autoApplyController;
