import { DataSource } from "typeorm";
import config from "../config";
import { TriviaUser } from "./entities/TriviaUser";

export const db = new DataSource({
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

export default db;
