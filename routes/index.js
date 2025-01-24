import { Router } from "express";

import userRoutes from "./v1/user/index.js"
import alumniRoutes from "./v1/alumni/index.js"
import adminRoutes from "./v1/admin/index.js"
import alumni_student_Routes from "./v1/alumni_student/index.js"
import { checkForAuthentication , restrictToOnly } from "../middlewares/auth.js";
import { seed } from "../service/seed.js";
const router = Router()


// Only admin access this route

router.use("/v1/admin",checkForAuthentication, restrictToOnly("ADMIN"),adminRoutes)

// Both student and alumni 
router.use("/v1/alumni-student" , alumni_student_Routes)

// All can access this route
router.use("/v1/user" , userRoutes)


//Seeding database
router.post("/v1/seed" , seed)


export default router