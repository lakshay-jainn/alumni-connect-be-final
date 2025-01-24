import { Router } from "express";

import userRoutes from "./v1/user/index.js"
import alumniRoutes from "./v1/alumni/index.js"
import adminRoutes from "./v1/admin/index.js"
import { checkForAuthentication , restrictToOnly } from "../middlewares/auth.js";
const router = Router()


// Only admin access this route

router.use("/v1/admin",checkForAuthentication, restrictToOnly("ADMIN"),adminRoutes)

// Both student and alumni 
router.use("/v1/alumni" , alumniRoutes)

// All can access this route
router.use("/v1/user" , userRoutes)


export default router