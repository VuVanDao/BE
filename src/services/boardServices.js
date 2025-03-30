import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/BoardModel";
import ApiError from "~/utils/ApiError";
import slugify from "~/utils/formatter";

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };
    const createdBoard = await boardModel.createNew(newBoard);
    const getNewBoard = await boardModel.findOneByID(createdBoard.insertedId);
    console.log("getNewBoard", getNewBoard);

    return getNewBoard;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (boardId) => {
  try {
    const board = await boardModel.getDetail(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    return board;
  } catch (error) {
    throw error;
  }
};
export const BoardService = {
  createNew,
  getDetail,
};
