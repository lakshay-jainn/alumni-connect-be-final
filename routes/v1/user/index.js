import { Router } from "express";
// import { checkForAuthentication } from "../../../middlewares/auth.js";
import {
  handleUserSignupController,
  handleUserLoginController,
  handleUserForgetPassword,
  handleUserResetPassword
} from "../../../controller/UserController.js";

const router = Router();

router.post("/signup", handleUserSignupController);
router.post("/signin", handleUserLoginController);
router.post("/forget-password",handleUserForgetPassword)
router.post("/reset-password", handleUserResetPassword)

export default router;
