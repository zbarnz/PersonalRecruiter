import "reflect-metadata";

import { AppDataSource } from "../data-source";

import { logger } from "../lib/logger/pino.config";

import express from "express";
import router from "./routes";
import cors from "cors";

//For docker to init db

const start = async () => {
  if (process.env.NODE_ENV == "local") {
    logger.info("Initializing Database");
    await AppDataSource.initialize();
  }
  logger.info("Database initialized");

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const allowedOrigins = [
    "https://smartapply.indeed.com",
    "https://m5.apply.indeed.com",
  ];

  if (process.env.NODE_ENV === "local") {
    logger.info("Configuring local routes");

    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            !origin ||
            origin === "http://localhost:3000" ||
            origin.startsWith("chrome-extension://") ||
            allowedOrigins.includes(origin)
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"), false);
          }
        },
        credentials: true, // if your API expects credentials
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
      })
    );
  } else if (process.env.NODE_ENV === "production") {
    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            !origin ||
            origin === "http://localhost:3000" ||
            origin.startsWith("chrome-extension://") ||
            allowedOrigins.includes(origin)
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"), false);
          }
        },
        credentials: true, // if your API expects credentials
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
        allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
      })
    );
  } else {
    throw new Error("ENV not valid");
  }

  app.use("/api/", router);

  const port = process.env.PORT || 4000;

  logger.info("listening on port: " + port);
  app.listen(port);
};

start();
