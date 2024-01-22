import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(404)
        .json(new ApiError(404, false, "Unauthorized request"));
    }

    const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedTokenInfo?._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json(new ApiError(404, false, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, false, "Invalid access token" || error?.message));
  }
});
