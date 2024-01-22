import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(cookieParser());

app.use(express.static("public"));

app.use(morgan("tiny"));

// health check router
import healthCheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);

// user router
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

// password router
import passwordRouter from "./routes/password.routes.js";
app.use("/api/v1/passwords", passwordRouter);

export { app };
