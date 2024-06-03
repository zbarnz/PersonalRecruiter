import "reflect-metadata";
import { logger } from "../../../lib/logger/pino.config";

import { testDataSource } from "../../../data-source";
import { DataSource } from "typeorm";

export async function clean(excludeEntities: string[] = []) {
  try {
    //need to reset host property as we are accessing the db from outside the docker container
    const dataSource = new DataSource(testDataSource);

    const getConnection = async (): Promise<DataSource> => {
      try {
        if (!dataSource.isInitialized) {
          const connection = await dataSource.initialize();
          return connection;
        } else {
          return dataSource;
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

    const connection = await getConnection();

    const entities = connection.entityMetadatas.filter(
      (entity) =>
        !excludeEntities
          .map((e) => e.toLowerCase())
          .includes(entity.name.toLowerCase())
    );

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }

    await connection.destroy();
  } catch (error) {
    logger.error("Cannot clean db " + error);
  }
}
