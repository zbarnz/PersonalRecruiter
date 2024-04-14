import { DataSource } from "typeorm";
import { Listing } from "../entity/Listing";
import { JobBoard } from "../entity/JobBoard";
import { AutoApply } from "../entity/AutoApply";
import { GPTLog } from "../entity/GPTLog";
import { User } from "../entity/User";

const hydrateDatabase = async () => {
  console.log("Hydrating DB..");

  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5436,
    username: "admin",
    password: "password",
    database: "autoapply",
    synchronize: true,
    logging: false,
    entities: [Listing, JobBoard, AutoApply, GPTLog, User], //can also import like "src/entity/*.ts"
    migrations: [],
    subscribers: [],
  });

  const getConnection = async (): Promise<DataSource> => {
    try {
      if (!AppDataSource.isInitialized) {
        let connection;
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

  const user1 = new User();
  user1.firstName = "Zach";
  user1.lastName = "Barnes";
  user1.email = "zbarnz@yahoo.com";
  user1.phone = "7207557572";
  user1.createdAt = Math.floor(Date.now() / 1000);

  const user2 = new User();
  user2.firstName = "Sumedha";
  user2.lastName = "Shreshtha";
  user2.email = "ss@sumedhaiscool.com";
  user2.phone = "1929291102";
  user2.createdAt = Math.floor(Date.now() / 1000);

  const connection = await getConnection();

  await connection.manager.save([user1, user2]);

  // Creating and saving a JobBoard instance
  const jobBoard1 = new JobBoard();
  jobBoard1.name = "Indeed";

  await connection.manager.save(jobBoard1);
  await connection.destroy();
};

hydrateDatabase().then(() => {
  console.log("Data has been hydrated!");
});
