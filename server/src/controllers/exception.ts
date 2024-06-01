import { Request, Response } from "express";
import { getConnection } from "../../data-source";

import { Exception } from "../entity/Exception";

export const createException = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const exceptionData = {
      listingId: req.body.listingId,
      dateUpdated: Math.floor(Date.now() / 1000), // Current time in UNIX timestamp
      reason: req.body.reason,
      jobBoard: req.body.jobBoard,
      userId: req.body.userId,
    };
    const exception = connection.manager.create(Exception, exceptionData);
    const savedException = await connection.manager.save(exception);
    res.json(savedException);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

const exceptionController = { createException };
export default exceptionController;
