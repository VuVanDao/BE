import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/BoardModel";
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

export const ColumnService = {
  createNew,
};
