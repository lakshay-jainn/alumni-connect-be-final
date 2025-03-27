import {Router} from "express"
import { ProfileGenerateUploadSignature,FeedsGenerateUploadSignature,saveImage } from "../../../controller/MediaController.js";

const router = Router()

// Configure Cloudinary


// Generate Cloudinary signature
router.post("/profile-generate-upload-signature",ProfileGenerateUploadSignature);
router.post("/feeds-generate-upload-signature",FeedsGenerateUploadSignature);
// Save to database
router.post("/save-image",saveImage );

export default router;

