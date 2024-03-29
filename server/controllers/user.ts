import { User } from "../entity/User";
import { getConnection } from "../data-source";

import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    console.log(req);
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
    const userId = req.params._id;
    const connection = await getConnection();
    const user = await connection.manager.findOne(User, {
      where: { id: Number(userId) },
    });

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
