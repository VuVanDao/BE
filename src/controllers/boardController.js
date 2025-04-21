/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from "http-status-codes";
import { BoardService } from "~/services/boardServices";
const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;

    const createNewBoard = await BoardService.createNew(userId, req.body);
    res.status(StatusCodes.CREATED).json(createNewBoard);
  } catch (error) {
    next(error);
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message });
  }
};
const getDetail = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const board = await BoardService.getDetail(userId, boardId);
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updatedBoard = await BoardService.update(boardId, req.body);
    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};
const moveCardInDifferentColumn = async (req, res, next) => {
  try {
    const result = await BoardService.moveCardInDifferentColumn(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { page, itemPerPage } = req.query;
    const result = await BoardService.getBoards(userId, page, itemPerPage);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const boardController = {
  createNew,
  getDetail,
  update,
  moveCardInDifferentColumn,
  getBoards,
};
