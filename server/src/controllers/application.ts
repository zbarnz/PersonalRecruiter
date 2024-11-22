import { Request, Response } from "express";
import { getConnection } from "../../data-source";

import { Exception } from "../entity";

export const getApplications = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const reqData: any = {
      limit: req.body.limit,
      start: req.body.start,
    
    };
    
        const applications = connection.manager.get

    res.json(savedException);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

const exceptionController = { createException };
export default exceptionController;
