import { User } from "../entity";
import { getConnection } from "../../data-source";
import { logger } from "../../lib/logger/pino.config";
import { Request, Response } from "express";

//helpers
export const getUserHelper = async (id: User["id"]): Promise<User> => {
  const connection = await getConnection();
  const user = await connection.manager.findOne(User, {
    where: { id },
  });

  return user;
};

//route controller
export const createUser = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    logger.info("Create user request", req);
    const userData = req.body;
    const user = connection.manager.create(User, userData);
    const savedUser = await connection.manager.save(user);
    res.json(savedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params._id);

    const user = await getUserHelper(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const userController = { createUser, getUser };
export default userController;
