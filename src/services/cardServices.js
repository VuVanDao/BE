import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    };
    const createdCard = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneByID(createdCard.insertedId);
    if (getNewCard) {
      await columnModel.pushCardOderIds(getNewCard);
    }
    return getNewCard;
  } catch (error) {
    throw error;
  }
};

export const CardService = {
  createNew,
};
