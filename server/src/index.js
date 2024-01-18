import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDb from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectToDb().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server listening on port " + process.env.PORT);
  });
});