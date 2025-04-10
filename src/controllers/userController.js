import { StatusCodes } from "http-status-codes";
import { userServices } from "~/services/userServices";

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userServices.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
export const userController = { createNew };
