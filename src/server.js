/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import { CONNECT_DB, GET_DB } from "./config/mongodb";

const start_server = () => {
  const app = express();

  const hostname = "localhost";
  const port = 8080;

  app.get("/", async (req, res) => {
    console.log("", await GET_DB().listCollections().toArray());

    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(port, hostname, () => {
    console.log(`Hello Trung Quan Dev, I am running at ${hostname}:${port}/`);
  });
};
async () => {
  try {
    console.log("connecting your database");
    await CONNECT_DB();
    console.log("connected your database");
    start_server();
  } catch (error) {
    console.log("error from connect database", error);
    process.exit(0);
  }
};
// CONNECT_DB()
//   .then(() => {
//     console.log("connected your database");
//   })
//   .then(() => start_server())
//   .catch((error) => {
//     console.log("error from connect database", error);
//     process.exit(0);
//   });
