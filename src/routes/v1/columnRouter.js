/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";

import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";
import { authMiddleware } from "~/middlewares/authMiddleware";
const Router = express.Router();
Router.route("/").post(
  authMiddleware.isAuthorized,
  columnValidation.createNew,
  columnController.createNew
);

Router.route("/:id")
  //   .get(columnController.getDetail)
  .put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    columnController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    columnValidation.Delete,
    columnController.Delete
  );
export const columnRouter = Router;
