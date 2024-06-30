import { NextFunction, Request, Response } from "express";
import { logger } from "../logger/pino.config";

export const reqLog = (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const logBody = { ...req.body };
    if (req.originalUrl.includes("/user") && logBody.password) {
      logBody.password = "********";
    }

    logger.info("Request received", {
      method: req.method,
      url: req.originalUrl,
      body: logBody,
    });
    logger.debug("Full request", { req });

    const baseSend = res.send;

    res.send = (data) => {
      logger.debug("Response payload", { payload: data });

      res.send = baseSend;

      return res.send(data);
    };
    // eslint-disable-next-line no-empty
  } catch (error) {}

  next();
};
