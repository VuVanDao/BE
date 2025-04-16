/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { boardValidation } from "~/validations/boardValidation";
const Router = express.Router();
Router.route("/")
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew
  );
Router.route("/:id")
  .get(authMiddleware.isAuthorized, boardController.getDetail)
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    boardController.update
  );
Router.route("/supports/moving_cards").put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardInDifferentColumn,
  boardController.moveCardInDifferentColumn
);
export const boardRouter = Router;
