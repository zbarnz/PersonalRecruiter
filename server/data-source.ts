import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Listing } from "./src/entity/Listing";
import { JobBoard } from "./src/entity/JobBoard";
import { AutoApply } from "./src/entity/AutoApply";
import { GPTLog } from "./src/entity/GPTLog";
import { User } from "./src/entity/User";
import { Exception } from "./src/entity/Exception";
import { PDF } from "./src/entity/PDF";
import { UserApplicantConfig } from "./src/entity/UserApplicantConfig";

import { logger } from "./lib/logger/pino.config";

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
    Listing,
    JobBoard,
    AutoApply,
    GPTLog,
    User,
    Exception,
    PDF,
    UserApplicantConfig,
  ], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

let dbConnectionString: string;

if (process.env.NODE_ENV === "production") {
  dbConnectionString = Buffer.from(
    process.env.DB_CONNECTION_STRING,
    "base64"
  ).toString("utf-8");

  if (!dbConnectionString) {
    throw new Error("No connection string supplied");
  }
}

export const prodDataSource: DataSourceOptions = {
  type: "cockroachdb",
  url: dbConnectionString,
  ssl: true,
  synchronize: false,
  logging: false,
  entities: [Listing, JobBoard, AutoApply, GPTLog, User, Exception, PDF], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

const dataSource =
  process.env.NODE_ENV === "production" ? prodDataSource : localDataSource;

export const AppDataSource = new DataSource(dataSource);

export const getConnection = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      const connection = await AppDataSource.initialize();
      return connection;
    } else {
      return AppDataSource;
    }
  } catch (error) {
    logger.info("Error initializing the database connection:", error);

    if (process.env.NODE_ENV != "production") {
      throw error;
    } else {
      throw "Cannot connect to db"; // Rethrow or handle as appropriate for your application
    }
  }
};
