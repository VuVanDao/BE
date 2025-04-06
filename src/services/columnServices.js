import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/BoardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };

    const createdColumn = await columnModel.createNew(newColumn);

    const getNewColumn = await columnModel.findOneByID(
      createdColumn.insertedId
    );
    if (getNewColumn) {
      getNewColumn.cards = [];
      await boardModel.pushColumnOderIds(getNewColumn);
    }
    return getNewColumn;
  } catch (error) {
    throw error;
  }
};
const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};
const Delete = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneByID(columnId);
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found");
    }
    // console.log("🚀 ~ Delete ~ targetColumn:", targetColumn);

    const deleteColumn = await columnModel.Delete(columnId);
    const deleteCard = await cardModel.DeleteManyByColumnId(columnId);
    const result = await boardModel.pullColumnOderIds(targetColumn);
    return { message: "delete successfully" };
  } catch (error) {
    throw error;
  }
};
export const ColumnService = {
  createNew,
  update,
  Delete,
};
