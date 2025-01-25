import { Router } from "express";
// import { checkForAuthentication } from "../../../middlewares/auth.js";
import {
  handleUserSignupController,
  handleUserLoginController,
} from "../../../controller/UserController.js";

const router = Router();

router.post("/signup", handleUserSignupController);
router.post("/signin", handleUserLoginController);

export default router;
