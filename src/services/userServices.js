import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatter";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/brevoProvider";
import { JwtProvider } from "~/providers/jwtProvider";
import { env } from "~/config/environment";
const createNew = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (existsUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email is already exists");
    }
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4(),
    };

    const createdUser = await userModel.createNew(newUser);
    const getUser = await userModel.findOneByID(createdUser.insertedId);
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`;
    const customSubject = "plz verify your email before using our services";
    const htmlContent = `
    <h3>Here is your verification link</h3>
    <h3>${verificationLink}</h3> 
    <h3>From Admin: Van Dao</h3>
    `;
    await BrevoProvider.sendEmail(getUser.email, customSubject, htmlContent);

    return pickUser(getUser);
  } catch (error) {
    throw error;
  }
};
const verifyAccount = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active"
      );
    }
    if (reqBody.token !== existsUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid");
    }
    const updateData = {
      isActive: true,
      verifyToken: null,
    };
    const updatedUser = await userModel.update(existsUser._id, updateData);

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};
const login = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (!bcryptjs.compareSync(reqBody.password, existsUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your email or password is incorrect"
      );
    }
    if (!existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active"
      );
    }

    // tao token tra ve phia fe
    //tao thong tin de dinh kem trong jwt: _id va email cua user
    const userInfo = {
      _id: existsUser._id,
      email: existsUser.email,
    };
    //tao ra 2 loai token, access token, refresh token
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );
    return { accessToken, refreshToken, ...pickUser(existsUser) };
  } catch (error) {
    throw error;
  }
};

export const userServices = { createNew, verifyAccount, login };
