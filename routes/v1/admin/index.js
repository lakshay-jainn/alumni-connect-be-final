import { Router } from "express";

const router = Router()

router.get("/" , (req ,res) => {
    res.json({message: "welcome admin"})
})
export default router