/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const createNew = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    const newCardToAdd = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
      columnId: new ObjectId(validateData.columnId),
    };
    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd);
    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const invalidUpdateFields = ["_id", "createdAt", "boardId"];

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (invalidUpdateFields.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId);
    }
    // console.log("updateData", updateData);
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    // console.log("result", result);

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};
const DeleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneByID,
  update,
  DeleteManyByColumnId,
};
