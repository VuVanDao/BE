/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";

import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";
const Router = express.Router();
Router.route("/").post(columnValidation.createNew, columnController.createNew);

Router.route("/:id")
  //   .get(columnController.getDetail)
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.Delete, columnController.Delete);
export const columnRouter = Router;
