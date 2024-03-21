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

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "dev") {
    app.use(cors({ origin: "http://localhost:3000" }));
  } else {
    //TODO setup prod
    throw new Error("production ENV not setup");
  }

  app.use("/api/", router);

  const port = process.env.PORT || 4000;

  app.listen(port);
};

start();
