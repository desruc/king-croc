import { DataSource } from "typeorm";
import config from "../config";
import { TriviaUser } from "./entities/TriviaUser";

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  synchronize: true,
  logging: true,
  entities: [TriviaUser],
  subscribers: [],
  migrations: []
});

async function initDb() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected!");
  } catch (error) {
    console.log(error);
  }
}

export default initDb;
