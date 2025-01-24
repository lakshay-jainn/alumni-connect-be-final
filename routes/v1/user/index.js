import { Router } from "express";
// import { checkForAuthentication } from "../../../middlewares/auth.js";
import {
  handleUserSignup,
  handleUserLogin,
} from "../../../controller/UserController.js";

const router = Router();

router.post("/signup", handleUserSignup);
router.post("/signin", handleUserLogin);

export default router;
