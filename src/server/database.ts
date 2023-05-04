import { Sequelize } from "sequelize-typescript";

import cls from "cls-hooked";

const databaseSpace = cls.createNamespace("databaseSpace");
// eslint-disable-next-line react-hooks/rules-of-hooks
Sequelize.useCLS(databaseSpace);

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    models: [__dirname + "/models/*"],
  }
);
