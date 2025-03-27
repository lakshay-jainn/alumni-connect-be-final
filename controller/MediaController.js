import { prisma } from "../libs/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from 'uuid';
/*  i am first calling generateUploadSignature on frontend to get a signed
 signature(which is required when uploading to cloudinary) 
and userid of user as i will be saving the profile pic by the name of the user's userid . 
so when i recive the signature and neccessary detials on frontend 
i call the clouddinary api on frontend to directly upload the img to cloudinary . 
which will then return us a url on frontend which we can store on our database using an api call.
*/



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function FeedsGenerateUploadSignature(req,res){
  try {
    const userId=req.user.id
    const {folder} = req.body;
    // Parameters for Cloudinary upload
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId= `${userId}-${uuidv4()}`

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        public_id: publicId, 
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      publicId,
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Failed to generate signature"});
  }
}


export function ProfileGenerateUploadSignature(req,res){
  try {
    const userId=req.user.id
    const {folder} = req.body;
    // Parameters for Cloudinary upload
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        public_id: userId, 
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      publicId:userId,
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Failed to generate signature"});
  }
}




//i am updating the profile pic on the full profile form , this function i made is if we wanted to upload a single url of image to database.

export async function saveImage(req,res){
  try {
    const { profileImage } = req.body;
    const userId = req.user.id;
    const role=req.user.role;
    
    await prisma.user.update({
      where: { id: userId ,role:role},
      data: { profileImage: profileImage },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save image URL" });
  }
}