import "reflect-metadata";

import { AppDataSource } from "../data-source";

import express from "express";
import router from "./routes";
import cors from "cors";

import { JobBoard } from "../entity/JobBoard";
import { Listing } from "../entity/Listing";

//For docker to init db

const start = async () => {
  await AppDataSource.initialize();
  console.log("Database initialized");

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "dev") {
    console.log("Building for DEV");

    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            !origin ||
            origin === "http://localhost:3000" ||
            origin.startsWith("chrome-extension://")
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
    //TODO setup prod
    throw new Error("production ENV not setup");
  }

  app.use("/api/", router);

  const port = process.env.PORT || 4000;

  console.log("listening on port: " + port);
  app.listen(port);
};

start();