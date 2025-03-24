/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";

const start_server = () => {
  const app = express();

  app.get("/", async (req, res) => {
    console.log("", await GET_DB().listCollections().toArray());

    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}`
    );
  });
  exitHook(async () => {
    console.log("prepare to close sever and database");
    await CLOSE_DB().then(() => {
      console.log("close sever and database successfully");
    });
  });
};
(async () => {
  try {
    console.log("connecting your database");
    await CONNECT_DB();
    console.log("connected your database");
    start_server();
  } catch (error) {
    console.log("error from connect database", error);
    process.exit(0);
  }
})();
// CONNECT_DB()
//   .then(() => {
//     console.log("connected your database");
//   })
//   .then(() => start_server())
//   .catch((error) => {
//     console.log("error from connect database", error);
//     process.exit(0);
//   });
