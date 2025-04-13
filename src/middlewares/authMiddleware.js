import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/jwtProvider";
import ApiError from "~/utils/ApiError";

const isAuthorized = async (req, res, next) => {
  //lay accessToken nam trong request cookies phia client -withCredentials
  const clientAccessToken = req.cookies?.accessToken;

  //neu client accessToken ko ton tai
  if (!clientAccessToken) {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        "unauthorized: accessToken not found"
      )
    );
    return;
  }
  try {
    //giai ma token
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    //token hop le:luu vao req.jwtDecoded de dung
    req.jwtDecoded = accessTokenDecoded;
    next();
  } catch (error) {
    //neu accessToken bi het han: tra ve 1 ma loi ne FE biet ma refresh token (410)
    if (error.message.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token"));
      return;
    }
    //neu accessToken ko hop le: tra ve loi cho FE
    next(new ApiError(StatusCodes.UNAUTHORIZED, "unauthorized"));
  }
};
export const authMiddleware = {
  isAuthorized,
};
