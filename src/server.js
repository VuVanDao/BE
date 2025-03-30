/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/ErrorHandleMiddleware";
import cors from "cors";
import { corsOptions } from "./config/cors";
const start_server = () => {
  const app = express();
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/v1", APIs_V1);
  app.use(errorHandlingMiddleware);

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
