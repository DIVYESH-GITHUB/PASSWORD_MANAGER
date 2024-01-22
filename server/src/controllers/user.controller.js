import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import sendVerificationEmail from "../utils/nodemailer.js";
import crypto from "crypto";
import fs from "fs";

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const registeruser = asyncHandler(async (req, res) => {
  const {
    email,
    userName,
    fullName,
    password,
    confirmPassword,
    masterPassword,
    confirmMasterPassword,
  } = req.body;

  // Email validation
  if (!email) {
    return res.status(400).json(new ApiError(400, false, "Email not provided"));
  }
  if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    return res.status(400).json(new ApiError(400, false, "Email is not valid"));
  }

  // Username validation
  if (!userName) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Username not provided"));
  }
  if (!userName.match("^[a-z0-9_-]{3,16}$")) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Username is not valid"));
  }

  // Fullname validation
  if (!fullName) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Fullname not provided"));
  }
  if (!fullName.match("^(?![. ])[a-zA-Z. ]+(?<! )$")) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Fullname is not valid"));
  }

  // Password validation
  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password not provided"));
  }
  if (password.length <= 6) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          false,
          "Password length should be more than 6 characters"
        )
      );
  }

  if (password != confirmPassword) {
    return res
      .status(400)
      .json(
        new ApiError(400, false, "Password and confirm password doesn't match")
      );
  }

  // Master password validation
  if (!masterPassword) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Master password not provided"));
  }
  if (masterPassword.length <= 6) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          false,
          "Master password length should be more than 6 characters"
        )
      );
  }

  if (masterPassword != confirmMasterPassword) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Passwords doesn't match"));
  }

  // check is user already exist
  const existingUser = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  });

  if (existingUser) {
    return res
      .status(403)
      .json(
        new ApiError(403, false, "User with email or username already exist")
      );
  }

  const verificationToken = generateToken();

  // creating a new user
  const user = await User.create({
    email,
    userName,
    fullName,
    password,
    masterPassword,
    verificationToken,
  });

  // check if user created and removing the password field
  const createdUser = await User.findById(user._id).select(
    "-password -masterPassword"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, false, "Something went wrong while registering user")
      );
  }

  await sendVerificationEmail(email, verificationToken);

  // return final response along with user details
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully. Email is sent to you account, Please verify your email before logging in"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // email or username validation
  if (!emailOrUsername) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Email or user name is not specified"));
  }

  // password validation
  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password is not specified"));
  }

  // check if given user with given username or email exist
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
  });

  if (!user) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          false,
          "User with specified Email or username doesn't exist"
        )
      );
  }

  if (!user.isVerified) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          false,
          "User is not verified, please verify your email"
        )
      );
  }

  // check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Inlvaid credentials"));
  }

  // remove the password field
  const loggedInuser = await User.findById(user._id).select("-password");

  // generate ascess token
  const accessToken = user.generateAccessToken();

  // return user along with access token
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInuser,
        accessToken: accessToken,
      },
      "User logged in successfully"
    )
  );
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { password, oldPassword } = req.body;

  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password is not specified"));
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, false, "Incorrect password"));
  }

  user.password = password;

  const updatedUser = await user.save({ validateBeforeSave: false });

  return res
    .status(404)
    .json(new ApiResponse(200, updatedUser, "Password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { userName, fullName } = req.body;

  if (!userName && !fullName) {
    return res
      .status(400)
      .json(
        new ApiError(400, false, "atleast one field is required to update")
      );
  }

  const user = await User.findById(req.user._id);

  if (userName && user.userName == userName.trim()) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Old username provided"));
  }

  if (fullName && user.fullName == fullName.trim()) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Old full name provided"));
  }

  const userWithSameUsername = await User.findOne({ userName });
  if (userWithSameUsername) {
    return res
      .status(401)
      .json(
        new ApiError(401, false, "username already in use, try other username")
      );
  }

  if (userName) {
    user.userName = userName;
  }
  if (fullName) {
    user.fullName = fullName;
  }

  const updatedUser = await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const verfiyToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    const errorFilePath =
      "C:\\Users\\divye\\OneDrive\\Desktop\\PASSWORD_MANAGER\\server\\src\\utils\\verification-error.html";
    const errorHtmlContent = fs.readFileSync(errorFilePath, "utf8");

    return res.status(400).send(errorHtmlContent);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  const filePath =
    "C:\\Users\\divye\\OneDrive\\Desktop\\PASSWORD_MANAGER\\server\\src\\utils\\verification-success.html";
  const htmlContent = fs.readFileSync(filePath, "utf8");

  return res.status(200).send(htmlContent);
});

export {
  registeruser,
  loginUser,
  changeUserPassword,
  updateUserDetails,
  getCurrentUser,
  verfiyToken,
};
