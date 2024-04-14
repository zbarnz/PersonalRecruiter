import "reflect-metadata";
import { DataSource } from "typeorm";
import { Listing } from "./entity/Listing";
import { JobBoard } from "./entity/JobBoard";
import { AutoApply } from "./entity/AutoApply";
import { GPTLog } from "./entity/GPTLog";
import { User } from "./entity/User";
import { Exception } from "./entity/Exception";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "admin",
  password: "password",
  database: "autoapply",
  synchronize: true,
  logging: false,
  entities: [Listing, JobBoard, AutoApply, GPTLog, User, Exception], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
});

let connection;

export const getConnection = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      connection = await AppDataSource.initialize();
      return connection;
    } else {
      return AppDataSource;
    }
  } catch (error) {
    console.error("Error initializing the database connection:", error);
    throw error; // Rethrow or handle as appropriate for your application
  }
};
