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
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";
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

    const userInfo = {
      _id: existsUser._id,
      email: existsUser.email,
    };
    //tao ra 2 loai token, access token, refresh token
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    );
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: ms("14 days"), //thoi gian song cua cookie
    // });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: ms("14 days"), //thoi gian song cua cookie
    // });
    return { accessToken, refreshToken, ...pickUser(existsUser) };
  } catch (error) {
    throw error;
  }
};
const refreshToken = async (clientRefreshToken) => {
  try {
    //giai ma refreshToken tu client
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    // tao token tra ve phia fe
    //tao thong tin de dinh kem trong jwt: _id va email cua user
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };
    //tao ra refresh token
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};
const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existsUser = await userModel.findOneByID(userId);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (!existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active"
      );
    }
    let updatedUser = {};
    //th1:change password
    if (reqBody.current_password && reqBody.new_password) {
      if (
        !bcryptjs.compareSync(reqBody.current_password, existsUser.password)
      ) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Your email or password is incorrect"
        );
      }
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8),
      });
    } else if (userAvatarFile) {
      const uploadResult = await cloudinaryProvider.StreamUpload(
        userAvatarFile.buffer,
        "users"
      );
      //th2:change avatar, upload file len cloudinary
      updatedUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url,
      });
    } else {
      //th3:change other fields
      updatedUser = await userModel.update(userId, reqBody);
    }
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

export const userServices = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
};
