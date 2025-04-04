/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from "http-status-codes";
import { ColumnService } from "~/services/columnServices";
const createNew = async (req, res, next) => {
  try {
    const createNewColumn = await ColumnService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createNewColumn);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const updatedColumn = await ColumnService.update(columnId, req.body);
    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
export const columnController = {
  createNew,
  update,
};
