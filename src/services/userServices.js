import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatter";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/brevoProvider";
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

export const userServices = { createNew };
