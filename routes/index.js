import { Router } from "express";

import userRoutes from "./v1/user/index.js"
import connectionRoutes from "./v1/connection/index.js"
import mediaRoutes from './v1/handle-media/index.js'
import adminRoutes from "./v1/admin/index.js"
import alumni_student_Routes from "./v1/profile/index.js";
import postRoutes from "./v1/post/index.js"
import communityRoutes from "./v1/community/index.js"
import { checkForAuthentication , restrictToOnly } from "../middlewares/auth.js";
import { authLimiter } from "../config/rateLimiter.js";
// import { seed } from "../services/seed.js";
const router = Router()


// Only admin access this route

router.use("/admin",checkForAuthentication, restrictToOnly("ADMIN"),adminRoutes)
// router.use("/admin",adminRoutes)
// Both student and alumni 
router.use("/v1/alumni-student" ,checkForAuthentication, alumni_student_Routes)
router.use("/v1/connection",checkForAuthentication , connectionRoutes)
router.use("/v1/posts", checkForAuthentication,postRoutes)
router.use("/v1/community",checkForAuthentication,communityRoutes);


router.use("/v1/handle-media",checkForAuthentication , mediaRoutes)
// All can access this route
router.use("/v1/user" ,authLimiter, userRoutes)

// //Seeding database
// router.post("/v1/seed" , seed)

export default router
