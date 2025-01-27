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
      return res.status(404).json({ message: "User not found" });
    }

    let profile;

    if (user.role === "STUDENT" && user.studentProfile) {
      profile = {...user.studentProfile,email:user.email,username:user.username};
    } else if (user.role === "ALUMNI" && user.alumniProfile) {
      profile = {...user.alumniProfile,email:user.email,username:user.username};
    } else {
      return res.status(404).json({ message: "Profile not found for the given role" });
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
    res.status(200).json({
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

      
    if (createData.username ||  createData.email){
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.username !== undefined && { username: data.username }),
          ...(data.email !== undefined && { email: data.email }),
        },
      });
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