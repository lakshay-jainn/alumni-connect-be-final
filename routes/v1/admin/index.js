import { Router } from "express";

const router = Router()

router.get("/" , (req ,res) => {
    return res.json({message: "welcome admin", data:  req.user})
})
// router.post('/',checkForAuthentication, handleAdminLogin)
// router.post('/', handleAdminLogin)

export default router