import { Request, Response } from "express";
import { getConnection } from "../../data-source";
import { logger } from "../../lib/logger/pino.config";
import { passwordUtils } from "../../lib/utils/password";
import { User } from "../entity";

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

    const userData = req.body.user;
    const password = req.body.password;

    if (!userData.phone || !userData.email || !password) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const existingUser = await connection.manager.findOne(User, {
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    ({ hash: userData.hash, salt: userData.salt } =
      passwordUtils.genPassword(password));

    logger.info("Creating new user");

    const user = connection.manager.create(User, userData);
    const { salt, hash, ...savedUser } = await connection.manager.save(user);
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
