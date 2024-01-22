import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Password } from "../models/password.model.js";
import { PASSWORD_CATEGORIES } from "../constants.js";

const createPassword = asyncHandler(async (req, res) => {
  const { category, name, value, url, userName, notes } = req.body;

  // Category validation
  if (!category) {
    return res
      .status(400)
      .json(
        new ApiError(400, false, "Category for the password is not specified")
      );
  }

  // password name validation
  if (!name) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Name for the password is not specified"));
  }
  if (name.trim() == "") {
    return res
      .status(400)
      .json(new ApiError(400, false, "Name cannot be empty"));
  }

  // password value validation
  if (!value) {
    return res
      .status(400)
      .json(new ApiError(400, false, "password is not specified"));
  }
  if (value.trim() == "") {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password cannot be empty"));
  }

  // Url validation
  if (url?.trim() == "") {
    return res
      .status(400)
      .json(new ApiError(400, false, "Url cannot be empty"));
  }

  // Username validation
  if (userName?.trim() == "") {
    return res
      .status(400)
      .json(new ApiError(400, false, "Username cannot be empty"));
  }

  // notes validation
  if (notes?.trim() == "") {
    return res
      .status(400)
      .json(new ApiError(400, false, "Notes cannot be empty"));
  }

  // check if password with same name already exists
  const sameNamePassword = await Password.findOne({
    name: name,
    owner: req.user._id,
  });

  if (sameNamePassword) {
    return res
      .status(401)
      .json(new ApiError(401, false, "Password with same name already exists"));
  }

  // create a new password
  const password = await Password.create({
    owner: req.user._id,
    category,
    name,
    value,
    url,
    userName,
    notes,
  });

  if (!password) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          false,
          "Password can't be created, please try again..!"
        )
      );
  }

  // return the response with password
  return res
    .status(201)
    .json(new ApiResponse(201, password, "Password created successfully"));
});

const getAllPasswords = asyncHandler(async (req, res) => {
  const passwords = await Password.find({
    owner: req.user._id,
  });

  if (passwords.length == 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No passwords found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, passwords, "Passwords fetched successfully"));
});

const getPasswordById = asyncHandler(async (req, res) => {
  const { passwordId } = req.params;

  if (!passwordId) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not specified"));
  }

  if (!mongoose.Types.ObjectId.isValid(passwordId)) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  const password = await Password.findById(passwordId);

  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  password.value = await password.decryptPassword();

  return res
    .status(200)
    .json(new ApiResponse(200, password, "Password fetched successfully"));
});

const deletePasswordById = asyncHandler(async (req, res) => {
  const { passwordId } = req.params;

  if (!passwordId) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not specified"));
  }

  if (!mongoose.Types.ObjectId.isValid(passwordId)) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  const password = await Password.findByIdAndDelete(passwordId);

  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, password, "Password deleted successfully"));
});

const updatePasswordById = asyncHandler(async (req, res) => {
  const { passwordId } = req.params;
  const { category, name, value, url, userName, notes } = req.body;

  if (!passwordId) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not specified"));
  }

  if (!mongoose.Types.ObjectId.isValid(passwordId)) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  const password = await Password.findById(passwordId);

  if (!password) {
    return res.status(400).json(new ApiError(400, false, "Password not found"));
  }

  // category update
  if (category?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "category cannot be empty"));
  } else {
    if (category && !PASSWORD_CATEGORIES.includes(category)) {
      return res.status(401).json(new ApiError(401, false, "Invalid category"));
    }
    password.category = category ? category : password.category;
  }

  // name update
  if (name?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "name cannot be empty"));
  } else {
    const sameNamePassword = await Password.findOne({
      name: name,
      owner: req.user._id,
    });

    if (sameNamePassword) {
      return res
        .status(401)
        .json(
          new ApiError(401, false, "Password with same name already exists")
        );
    }
    password.name = name ? name : password.name;
  }

  // password value validation
  if (value?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "value cannot be empty"));
  } else {
    password.value = value ? value : password.value;
  }

  // url validation
  if (url?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "url cannot be empty"));
  } else {
    password.url = url ? url : password.url;
  }

  // username validation
  if (userName?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "Username cannot be empty"));
  } else {
    password.userName = userName ? userName : password.userName;
  }

  // notes validation
  if (notes?.trim() == "") {
    return res
      .status(401)
      .json(new ApiError(401, false, "Username cannot be empty"));
  } else {
    password.notes = notes ? notes : password.notes;
  }

  // update the password
  const updatedPassword = await password.save({
    validateBeforeSave: false,
  });

  if (!updatedPassword) {
    return res
      .status(500)
      .json(new ApiError(500, false, "Password cannot be updated, try again"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPassword, "Password updated successfully")
    );
});

const getPasswordByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;

  const passwords = await Password.find({
    category: category,
    owner: req.user._id,
  });

  if (passwords.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No passwords were found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, passwords, "Passwords fetched successfully"));
});

const toggleFavouritePassword = asyncHandler(async (req, res) => {
  const { passwordId } = req.params;

  if (!passwordId) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not specified"));
  }

  if (!mongoose.Types.ObjectId.isValid(passwordId)) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password Id is not valid"));
  }

  const password = await Password.findById(passwordId);

  if (!password) {
    return res
      .status(400)
      .json(new ApiError(400, false, "Password does not exist"));
  }

  password.isFavourite = !password.isFavourite;

  await password.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        password,
        password.isFavourite
          ? "Password added to favorites successfully"
          : "Password removed from favorites successfully"
      )
    );
});

const getFavouritePasswords = asyncHandler(async (req, res) => {
  const favouritePasswords = await Password.find({
    owner: req.user._id,
    isFavourite: true,
  });

  if (favouritePasswords.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No favourite passwords were found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        favouritePasswords,
        "Favourite passwords fetched successfully"
      )
    );
});

export {
  createPassword,
  getAllPasswords,
  getPasswordById,
  deletePasswordById,
  updatePasswordById,
  getPasswordByCategory,
  toggleFavouritePassword,
  getFavouritePasswords,
};