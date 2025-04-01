import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Solution 1: Initialisation différée
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "tapakila",
  entities: [path.join(__dirname, "../entities/**/*.{js,ts}")],
  synchronize: false,
  logging: false
});
