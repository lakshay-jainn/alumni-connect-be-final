import {Router} from "express"
import { showProfileAlumniStudentController , createUpdateAlumniStudentProfileController } from "../../../controller/UpdateCreateController.js"
// import { checkForAuthentication } from "../../../middlewares/auth.js"
import { listAllAlumniController } from "../../../controller/ListingController.js"
const router = Router()

router.get("/profile-alumni-student" , showProfileAlumniStudentController )
router.post("/create-update-profile-alumni-student" , createUpdateAlumniStudentProfileController)
// router.patch("/update-profile-alumni-student" , checkForAuthentication , updateAlumniStudentProfile)

router.get("/showallalumni" , listAllAlumniController )

export default router;