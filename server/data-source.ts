import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Listing } from "./entity/Listing";
import { JobBoard } from "./entity/JobBoard";
import { AutoApply } from "./entity/AutoApply";
import { GPTLog } from "./entity/GPTLog";
import { User } from "./entity/User";
import { Exception } from "./entity/Exception";
import { PDF } from "./entity/PDF";

import { prodDataSource } from "secrets/dbconnection";

const devDatasource: DataSourceOptions = {
  type: "cockroachdb",
  host: "cockroachdb",
  port: 26257,
  username: "root",
  password: "",
  database: "defaultdb",
  synchronize: true,
  logging: false,
  entities: [Listing, JobBoard, AutoApply, GPTLog, User, Exception, PDF], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
  timeTravelQueries: false,
};

export const AppDataSource = new DataSource(devDatasource);

export const getConnection = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      const connection = await AppDataSource.initialize();
      return connection;
    } else {
      return AppDataSource;
    }
  } catch (error) {
    console.error("Error initializing the database connection:", error);
    throw error; // Rethrow or handle as appropriate for your application
  }
};
