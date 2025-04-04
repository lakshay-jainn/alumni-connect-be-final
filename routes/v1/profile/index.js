import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";
import { baseProfileSchema } from "../../../config/zodSchema.js";
const router = Router();

router.get("/", async (req, res) => {
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

    const profileSelect =
      role === "STUDENT" ? "studentProfile" : "alumniProfile";

    const response = {
      email: user.email,
      profileImage: user.profileImage,
      username: user.username,
      profileCompletionPercentage:
        user[profileSelect].profileCompletionPercentage,
      banner: user[profileSelect].banner,

      //Basic
      basic: {...user[profileSelect].basic, userType: role},

      // resume
      resume: user[profileSelect].resume,

      //about
      about: user[profileSelect].about,

      // Skiils
      skills: user[profileSelect].skills,

      //Education
      education: user[profileSelect].education,

      //Work Experience
      workExperience: user[profileSelect].workExperience,

      //Achievements
      accomplishments: user[profileSelect].accomplishments,

      //personal details
      personalDetails: user[profileSelect].personalDetails,

      //social links
      socialLinks: user[profileSelect].socialLinks,

      //
    };
    return res.status(200).json(response);
  } catch (err) {
    return res.json({ message: "Internal server Error", err, e: err.message });
  }
});

router.post("/", async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const updates = req.body;

  const validation = baseProfileSchema.safeParse(updates);

  console.log("79", validation);

  if (!validation.success) {
    const errors = validation.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    return res.status(400).json({
      message: "Validation failed under these conditions",
      errors
    });
  }


  try {
    const profileSelect =
      role === "STUDENT" ? "studentProfile" : "alumniProfile";

    const jsonFields = [
      "basic",
      "education",
      "accomplishments",
      "personalDetails",
      "socialLinks",
      "workExperience",
    ];

    const regularFields = [
      'enrolmentNumber', 'skills', 'profileCompletionPercentage',
      'resume', 'about', 'banner', 'urls', 'batch', 'status'
    ];


    const filteredUpdates = Object.fromEntries(
      Object.entries(validation.data).filter(([_, v]) => v !== undefined)
    );

    const existingProfile = await prisma[profileSelect].findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const updateData = {}

    regularFields.forEach(field => {
      if (filteredUpdates[field] !== undefined) {
        updateData[field] = filteredUpdates[field];
      }
    });


    jsonFields.forEach(jsonField => {
      if (filteredUpdates[jsonField]) {
        updateData[jsonField] = {
          ...(existingProfile[jsonField] || {}),
          ...filteredUpdates[jsonField]
        };
      }
    });

    const updatedUser = await prisma[profileSelect].update({
      where: { userId },
      data: updateData,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server Error", err: err.message });
  }
});

router.post("/completion",async (req,res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const { profileCompletionPercentage } = req.body;

  try {
    const profileSelect =
      role === "STUDENT" ? "studentProfile" : "alumniProfile";
    
      const updateComplettion = await prisma[profileSelect].update({
        where: { userId },
        data: {
          profileCompletionPercentage,
        },
      });

      return res.status(200).json(updateComplettion.profileCompletionPercentage);
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error", err: error.message });
  }
})
export default router;
