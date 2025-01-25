import { prisma } from "../libs/prisma.js";

export async function showProfileAlumniStudentController(req, res) {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        studentProfile: role === "STUDENT" ? true : false,
        alumniProfile: role === "ALUMNI" ? true : false,
      },
    });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    let profile;

    if (user.role === "STUDENT" && user.studentProfile) {
      profile = user.studentProfile;
    } else if (user.role === "ALUMNI" && user.alumniProfile) {
      profile = user.alumniProfile;
    } else {
      return res.json({ message: "Profile not found for the given role" });
    }
    // Need it later when we need who requested the data

    // const userInfo = {
    //     id: user.id,
    //     username: user.username,
    //     email: user.email,
    //     role: user.role,
    //     created_at: user.created_at,
    // };
    
    // console.log("Profile.. " ,profile);
    // console.log("userinfo.. " , userInfo)
    res.json({
        // user:userInfo,
        profile
    })
  } catch (err) {
    res.json({message: "Internal server Error"}).status(500)
  }
}

export async function createUpdateAlumniStudentProfileController (req,res){

  
  const userId = req.user.id;
  const role = req.user.role;
  const {...createData} = req.body;
  
  if(!createData) {
    return res.json({message: "Please enter details"})
  }
  try{
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    
    if(!user){
      return res.json({message:"User not found"}).status(404)
    }

    let updatedProfile;

    if(role === "STUDENT"){
      updatedProfile = await prisma.studentProfile.upsert({
        where: {
          userId
        },
        update: {
          ...createData
        },
        create:{
          userId,
          ...createData
        }
      })
      console.log(updatedProfile)
    }
    else if (role === "ALUMNI"){
      updatedProfile = await prisma.alumniProfile.upsert({
        where: {
          userId
        },
        update: {
          ...createData
        },
        create: {
          userId,
          ...createData
        }
      })
    }
    else {
      return res.json({message: "Invalid role"}).status(400)
    }
  res.json({message: "Profile updated succesfully" , profile : updatedProfile}).status(200)
  }catch(e){
    res.json({message: "Failed to update profile"}).status(401)
  }
}