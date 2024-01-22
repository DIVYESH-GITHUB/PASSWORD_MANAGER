import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const healthcheck = asyncHandler(async (_, res, __) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Server running normally"));
});

export { healthcheck };
