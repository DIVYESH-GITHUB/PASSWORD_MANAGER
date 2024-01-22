import mongoose, { Schema } from "mongoose";
import { PASSWORD_CATEGORIES } from "../constants";

const PasswordSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: PASSWORD_CATEGORIES,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
    },
    userName: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Password = mongoose.model("Password", PasswordSchema);
