import { Router } from "express";
import { listAllAlumni } from "../../../controller/AlumniController.js";

const router = Router()

router.get("/showallalumni" , listAllAlumni )


export default router;