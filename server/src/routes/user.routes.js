import { Router } from "express";
import {
  changeUserPassword,
  getCurrentUser,
  loginUser,
  registeruser,
  updateUserDetails,
  verfiyToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

// un-protected routes
router.route("/register").post(registeruser);

router.route("/login").post(loginUser);

router.route("/verify/:token").get(verfiyToken);

// protected routes
router.route("/change-password").post(verifyJWT, changeUserPassword);

router.route("/update-details").post(verifyJWT, updateUserDetails);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

export default router;
