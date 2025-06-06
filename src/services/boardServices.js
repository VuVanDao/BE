import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { boardModel } from "~/models/BoardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";
import slugify from "~/utils/formatter";

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };
    const createdBoard = await boardModel.createNew(userId, newBoard);
    const getNewBoard = await boardModel.findOneByID(createdBoard.insertedId);
    // console.log("getNewBoard", getNewBoard);

    return getNewBoard;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetail(userId, boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      );
    });
    delete resBoard.cards;
    // console.log("resBoard", resBoard);

    return resBoard;
  } catch (error) {
    throw error;
  }
};
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const moveCardInDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now(),
    });
    return { updateResult: "Success" };
  } catch (error) {
    throw error;
  }
};
const getBoards = async (userId, page, itemPerPage, queryFilter) => {
  try {
    if (!page) {
      page = DEFAULT_PAGE;
    }
    if (!itemPerPage) {
      itemPerPage = DEFAULT_ITEM_PER_PAGE;
    }
    const result = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemPerPage, 10),
      queryFilter
    );
    return result;
  } catch (error) {
    throw error;
  }
};
export const BoardService = {
  createNew,
  getDetail,
  update,
  moveCardInDifferentColumn,
  getBoards,
};
