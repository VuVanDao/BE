import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";

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
const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateCard = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    let updatedCard = {};
    if (cardCoverFile) {
      const uploadResult = await cloudinaryProvider.StreamUpload(
        cardCoverFile.buffer,
        "card-cover"
      );
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
      });
    } else if (updateCard.commentToAdd) {
      //tao du lieu comment de them vao db, can bo sung de them data can thiet
      const commentData = {
        ...updateCard.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentAt: Date.now(),
      };
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else {
      //cac th update chung :title, description , ....
      updatedCard = await cardModel.update(cardId, updateCard);
    }
    return updatedCard;
  } catch (error) {
    throw error;
  }
};

export const CardService = {
  createNew,
  update,
};
