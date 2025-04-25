/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from "http-status-codes";
import { CardService } from "~/services/cardServices";
const createNew = async (req, res, next) => {
  try {
    const createNewCard = await CardService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createNewCard);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const cardCoverFile = req.file;
    const userInfo = req.jwtDecoded;
    const updateCard = await CardService.update(
      cardId,
      req.body,
      cardCoverFile,
      userInfo
    );
    res.status(StatusCodes.CREATED).json(updateCard);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  update,
};
