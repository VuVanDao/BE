/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouter } from "./boardRoutes";
const Router = express.Router();
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ Message: "API v1  are ready to use" });
});

// boards api
Router.use("/boards", boardRouter);
export const APIs_V1 = Router;
