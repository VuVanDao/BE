import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { cardModel } from "~/models/cardModel";

import ApiError from "~/utils/ApiError";
import slugify from "~/utils/formatter";

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    };
    const createdCard = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneByID(createdCard.insertedId);

    return getNewCard;
  } catch (error) {
    throw error;
  }
};

export const CardService = {
  createNew,
};
