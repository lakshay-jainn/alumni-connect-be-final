import {Router} from "express"
import { generateUploadSignature,saveImage } from "../../../controller/MediaController.js";

const router = Router()

// Configure Cloudinary


// Generate Cloudinary signature
router.post("/generate-upload-signature",generateUploadSignature);

// Save to database
router.post("/save-image",saveImage );

export default router;

