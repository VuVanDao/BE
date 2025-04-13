/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";

import { cardController } from "~/controllers/cardController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { cardValidation } from "~/validations/cardValidation";
const Router = express.Router();
Router.route("/").post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
);
// Router.route("/:id").get(cardController.getDetail).put();
export const cardRouter = Router;
