import {Router} from "express"
import { showProfileAlumniorStudent , createUpdateAlumniStudentProfile } from "../../../controller/UpdateCreateController.js"
import { checkForAuthentication } from "../../../middlewares/auth.js"
import { listAllAlumni } from "../../../controller/ListingController.js"
const router = Router()

router.get("/profile-alumni-student" ,checkForAuthentication, showProfileAlumniorStudent )
router.post("/create-update-profile-alumni-student" , checkForAuthentication , createUpdateAlumniStudentProfile)
// router.patch("/update-profile-alumni-student" , checkForAuthentication , updateAlumniStudentProfile)

router.get("/showallalumni",checkForAuthentication , listAllAlumni )

export default router;