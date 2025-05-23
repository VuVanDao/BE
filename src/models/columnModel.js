import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const createNew = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    const newColumnToAdd = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
    };
    const createdColumn = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(newColumnToAdd);
    return createdColumn;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const pushCardOderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        { returnDocument: "after" }
      );
    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};
const invalidUpdateFields = ["_id", "createdAt", "boardId"];

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (invalidUpdateFields.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }
    // console.log("updateData", updateData);
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
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
const Delete = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(columnId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneByID,
  pushCardOderIds,
  update,
  Delete,
};
// boardId: 67ea6a00609bdbb7c46dfbda,
//columnId: 67ea732d65b019c23d640d11,
// cardId:67ea742765b019c23d640d13
