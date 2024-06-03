import { JobBoard } from "../entity";
import { getConnection } from "../../data-source";

import { Request, Response } from "express";

//creates need to be done by a dev

export const getJobBoardByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const connection = await getConnection();
    const jobBoard = await connection.manager.findOne(JobBoard, {
      where: { name: name },
    });

    if (!jobBoard) {
      return res.status(404).json({ error: "Job Board not found." });
    }
    res.json(jobBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const jobBoardController = { getJobBoardByName };
export default jobBoardController;
