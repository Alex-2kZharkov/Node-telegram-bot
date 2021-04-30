// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CatalogEntity, OrderEntity, RoleEntity, StuffEntity, UserEntity } from "../../entities";

export const ENTITIES = [
  RoleEntity,
  UserEntity,
  CatalogEntity,
  StuffEntity,
  OrderEntity
];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_SECRET || "postgres",
  database: process.env.DB_NAME || "node-bot",
  entities: ENTITIES,
  synchronize: false
};

export const typeOrmCliConfig: TypeOrmModuleOptions = {
  ...typeOrmConfig,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrationsTableName: "migrations",
  migrations: ["src/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/migrations"
  }
};
