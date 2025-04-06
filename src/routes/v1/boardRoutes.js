/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import { boardValidation } from "~/validations/boardValidation";
const Router = express.Router();
Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ Message: "GET:API v1  get all boards" });
  })
  .post(boardValidation.createNew, boardController.createNew);
Router.route("/:id")
  .get(boardController.getDetail)
  .put(boardValidation.update, boardController.update);
Router.route("/supports/moving_cards").put(
  boardValidation.moveCardInDifferentColumn,
  boardController.moveCardInDifferentColumn
);
export const boardRouter = Router;
