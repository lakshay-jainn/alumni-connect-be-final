import {Router} from "express"
import { showProfileAlumniorStudent } from "../../../controller/AlumniController.js"
import { checkForAuthentication } from "../../../middlewares/auth.js"
const router = Router()

router.get("/profile-alumni-student" ,checkForAuthentication, showProfileAlumniorStudent )

export default router