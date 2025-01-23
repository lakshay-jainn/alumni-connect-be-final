import { Router } from "express";

import userRoutes from "./v1/user/index.js"

const router = Router()

router.use("/v1/user" , userRoutes)
// router.use("/v1" , userRoutes)

export default router