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
        profile: true
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("24",user)

    const profile = "profile";

    const response = {
      email: user.email,
      profileImage: user.profileImage,
      username: user.username,
      profileCompletionPercentage:
        user[profile].profileCompletionPercentage,
      banner: user[profile].banner,

      //Basic
      basic: {...user[profile].basic, userType: role},

      // resume
      resume: user[profile].resume,

      //about
      about: user[profile].about,

      // Skiils
      skills: user[profile].skills,

      //Education
      education: user[profile].education,

      //Work Experience
      workExperience: user[profile].workExperience,

      //Achievements
      accomplishments: user[profile].accomplishments,

      //personal details
      personalDetails: user[profile].personalDetails,

      //social links
      socialLinks: user[profile].socialLinks,

      //
    };
    return res.status(200).json(response);
  } catch (err) {
    return res.json({ message: "Internal server Error", err, e: err.message });
  }
});

router.post("/", async (req, res) => {
  const userId = req.user.id;

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
    const profile = "profile";

    const jsonFields = [
      "basic",
      "education",
      "accomplishments",
      "personalDetails",
      "socialLinks",
      "workExperience",
    ];

    const regularFields = [
      'enrollmentNumber', 'skills', 'profileCompletionPercentage',
      'resume', 'about', 'banner', 'urls', 'batch', 'status'
    ];


    const filteredUpdates = Object.fromEntries(
      Object.entries(validation.data).filter(([_, v]) => v !== undefined)
    );

    const existingProfile = await prisma[profile].findUnique({
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

    const updatedUser = await prisma[profile].update({
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

export default router;
