import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  dialect: "postgres" as Dialect,
};
