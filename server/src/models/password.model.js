import mongoose, { Schema } from "mongoose";
import { PASSWORD_CATEGORIES } from "../constants.js";
import crypto from "crypto";
import { algorithm, ivLength } from "../constants.js";

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
      trim: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PasswordSchema.pre("save", function (next) {
  if (this.isModified("value")) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv
    );
    let encrypted = cipher.update(this.value, "utf-8", "hex");
    encrypted += cipher.final("hex");
    this.value = `${iv.toString("hex")}:${encrypted}`;
  }
  next();
});

PasswordSchema.methods.decryptPassword = function () {
  const [ivString, encryptedValue] = this.value.split(":");

  if (!ivString || !encryptedValue) {
    throw new Error("Invalid encryptedValue format");
  }

  const iv = Buffer.from(ivString, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(process.env.ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedValue, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

export const Password = mongoose.model("Password", PasswordSchema);
