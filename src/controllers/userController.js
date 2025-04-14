import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { userServices } from "~/services/userServices";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userServices.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const verifyAccount = async (req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const result = await userServices.login(req.body);
    //xu li tra ve http only cookie cho phia trinh duyet
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ logged: true });
  } catch (error) {
    next(error);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const result = await userServices.refreshToken(req.cookies?.refreshToken);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, "Plz sign in first"));
  }
};
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const result = await userServices.update(userId, req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update,
};
