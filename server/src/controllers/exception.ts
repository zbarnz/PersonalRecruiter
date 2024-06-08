import { Request, Response } from "express";
import { getConnection } from "../../data-source";

import { Exception } from "../entity";

export const createException = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const exceptionData: any = {
      listing: req.body.listing,
      reason: req.body.reason,
      user: req.body.user,
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
