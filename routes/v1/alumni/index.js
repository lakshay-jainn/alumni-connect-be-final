import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  const userId = req.user.id;

  let { skip, take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 30;

  try {
    const alumnis = await prisma.profile.findMany({
      skip,
      take,
      where: {
        status: "ACCEPTED",
        user: {
          role: "ALUMNI",
          NOT: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const structuredAlumniData = alumnis
      .filter((alumni) => {
        if (alumni.workExperience && alumni.basic.course) {
          return true;
        } else {
          return false;
        }
      })
      .map((alumni) => {
        return {
          id: alumni.userId,
          name: alumni.basic.firstName + " " + (alumni.basic.lastName || ""),
          jobtitle:
            Object.entries(alumni.workExperience)[
              Object.entries(alumni.workExperience).length - 1
            ][1].designation || "",
          company:
            Object.entries(alumni.workExperience)[
              Object.entries(alumni.workExperience).length - 1
            ][1].organisation || "",
          course:
            (alumni.basic.course || "") +
            " " +
            (alumni.basic.courseSpecialization || ""),
          batch: alumni.batch || "",
          img: alumni.user.profileImage,
        };
      });
    console.log(structuredAlumniData);
    res.status(200).json(structuredAlumniData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to get alumni",
    });
  }
});

// get alumni by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const alumni = await prisma.profile.findUnique({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            profileImage: true,
            username: true,
            email: true,
          },
        },
      },
    });
    const { enrollmentNumber, profileCompletionPercentage, ...other } = alumni;

    res.status(200).json(other);
  } catch (error) {
    res.status(500).json({
      e: error,
      error: error.message,
      message: "Unable to get the alumni alumni",
    });
  }
});
export default router;
