import { Router } from "express";
import { listAllAlumni } from "../../../controller/ListingController.js";

// import { UpdateAlumniProfile } from "../../../controller/AlumniController.js";

const router = Router()

router.get("/showallalumni" , listAllAlumni )

// router.post("/create-alumni" , createAlumniProfile )
router.post("/update-alumni" ,  )

export default router;