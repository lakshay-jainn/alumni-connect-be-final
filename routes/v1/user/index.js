import {Router} from "express";
import {handleUserSignup , handleUserLogin} from "../../../controller/UserController.js"

const router = Router()

router.post('/signup',handleUserSignup)
router.post('/signin' , handleUserLogin)


export default router;

