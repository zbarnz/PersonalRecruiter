import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { DataSource } from "typeorm";
import { getConnection } from "../../data-source";
import { User } from "../../src/entity";
import { logger } from "../logger/pino.config";
import { jwtUtils } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      credentials?: JwtPayload & { user: User };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("authenticating", req.headers);

  try {
    const connection: DataSource = await getConnection();
    const auth = req.headers.authorization;
    const decoded: JwtPayload = jwtUtils.verifyJWT(auth);

    const userId = Number(decoded.sub);

    if (!userId) {
      throw new Error("cannot get auth sub");
    }

    const user = await connection.manager.findOne(User, {
      where: { id: userId },
    });

    if (user) {
      req.credentials = {
        ...decoded,
        user,
      };
    }

    next();
  } catch (err) {
    logger.error("Cannot authenticate", err);
    res.status(401).json({ success: false, msg: "Forbidden" });
  }
};
