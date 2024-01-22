import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPassword,
  deletePasswordById,
  getAllPasswords,
  getPasswordByCategory,
  getPasswordById,
  updatePasswordById,
  toggleFavouritePassword,
  getFavouritePasswords,
} from "../controllers/password.controller.js";

const router = Router();

router.use(verifyJWT);

// create password
router.route("/create-password").post(createPassword);

// get all passwords
router.route("/get-all-passwords").get(getAllPasswords);

// get password by id
router.route("/get-password/:passwordId").get(getPasswordById);

router.route("/get-password-category/:category").get(getPasswordByCategory);

// update password
router.route("/update-password/:passwordId").patch(updatePasswordById);

// delete password
router.route("/delete-password/:passwordId").delete(deletePasswordById);

router.route("/toggle-favourite/:passwordId").patch(toggleFavouritePassword);

router.route("/get-favourites").get(getFavouritePasswords);

export default router;