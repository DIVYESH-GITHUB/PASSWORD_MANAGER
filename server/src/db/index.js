import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Database connection established successfully");
  } catch (error) {
    console.log("Database connection error : " + error);
    process.exit(1);
  }
};

export default connectToDb;