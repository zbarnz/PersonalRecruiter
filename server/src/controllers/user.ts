import { Request, Response } from "express";
import { getConnection } from "../../data-source";
import { logger } from "../../lib/logger/pino.config";
import { jwtUtils } from "../../lib/utils/jwt";
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
export const registerUser = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    const userData: User = req.body.user;
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

    logger.info("Creating new user", userData);

    const user = connection.manager.create(User, userData);
    const { salt, hash, ...savedUser } = await connection.manager.save(user);
    const { token, expiresIn } = jwtUtils.issueJWT(userData);
    res.json({ user: savedUser, jwt: { token, expiresIn } });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    const email: User["email"] = req.body.email;
    const password: string = req.body.password;

    const user: User = await connection.manager.findOne(User, {
      where: { email },
      select: ["id", "email", "phone", "points", "salt", "hash"],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }

    const valid = passwordUtils.validatePassword(
      password,
      user.hash,
      user.salt
    );

    if (valid) {
      const { token, expiresIn } = jwtUtils.issueJWT(user);

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          points: user.points,
        },
        access_token: token,
        expiresIn,
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error!", details: error.message });
  }
};

export const refreshUser = async (req: Request, res: Response) => {
  const { user }: { user: User } = req.credentials;

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      points: user.points,
    },
  });
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

const userController = { registerUser, loginUser, refreshUser, getUser };
export default userController;
