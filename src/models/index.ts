import { Sequelize } from "sequelize-typescript";
import { models } from "./models";

const connection = new Sequelize("myDb", "", "", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  models: models,
});

connection
  .sync({ alter: false, logging: false })
  .then(() => {
    console.log("database connected successfullys");
  })
  .catch((error: any) => {
    console.log(error);
  });
export default connection;
