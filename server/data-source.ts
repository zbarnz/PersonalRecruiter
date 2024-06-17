import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import {
  AutoApply,
  Exception,
  GPTLog,
  JobBoard,
  Listing,
  PDF,
  User,
  UserApplicantConfig,
} from "./src/entity";

import path from "path";

import { logger } from "./lib/logger/pino.config";

let dbConnectionString: string;

const localDataSource: DataSourceOptions = {
  type: "cockroachdb",
  host: "cockroachdb",
  port: 26257,
  username: "root",
  password: "",
  database: "defaultdb",
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, "./**/*.entity{.ts,.js}"),
    path.join(__dirname, "./**/*.schema{.ts,.js}"),
  ],
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

export const testDataSource: DataSourceOptions = {
  type: "cockroachdb",
  host: "localhost",
  port: 26257,
  username: "root",
  password: "",
  database: "testdb",
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, "./**/*.entity{.ts,.js}"),
    path.join(__dirname, "./**/*.schema{.ts,.js}"),
  ],
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

export const prodDataSource: DataSourceOptions = {
  type: "cockroachdb",
  url: dbConnectionString,
  ssl: true,
  synchronize: false,
  logging: false,
  entities: [
    Listing,
    JobBoard,
    AutoApply,
    GPTLog,
    User,
    Exception,
    PDF,
    UserApplicantConfig,
  ],
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

if (process.env.NODE_ENV === "production") {
  dbConnectionString = Buffer.from(
    process.env.DB_CONNECTION_STRING,
    "base64"
  ).toString("utf-8");

  if (!dbConnectionString) {
    throw new Error("No connection string supplied");
  }
}

const dataSource =
  process.env.NODE_ENV === "test"
    ? testDataSource
    : process.env.NODE_ENV === "production"
    ? prodDataSource
    : localDataSource;

export const AppDataSource = new DataSource(dataSource);

export const getConnection = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      logger.info("new init");
      const connection = await AppDataSource.initialize();
      return connection;
    } else {
      logger.info("existing con");

      return AppDataSource;
    }
  } catch (error) {
    logger.info(
      "Error initializing the database connection: " + JSON.stringify(error)
    );

    if (process.env.NODE_ENV != "production") {
      throw error;
    } else {
      throw "Cannot connect to db";
    }
  }
};
