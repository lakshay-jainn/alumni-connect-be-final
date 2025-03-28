import { Router } from "express";

import { prisma } from "../../../libs/prisma.js";
const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "welcome admin" });
});

router.get("/pending", async (_, res) => {
  try {
    const students = await prisma.studentProfile.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });

    const alumni = await prisma.alumniProfile.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });

    const response = [
      ...students.map((student) => ({ ...student, type: "student" })),
      ...alumni.map((alumni) => ({ ...alumni, type: "alumni" })),
    ];

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Falied unexpectdly", error: error.message, e: error });
  }
});

router.post("/action/student", async (req, res) => {
  try {
    const { action, userId } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(action)) {
      return res.status(400).json({ message: "Action not allowed" });
    }

    const updatedStudent = await prisma.studentProfile.update({
      where: { userId },
      data: {
        status: action,
      },
      include: { user: {
        select: {
            username: true,
            profileImage: true
        }
      } },
    });
    return res.status(201).json(updatedStudent);

    // Integrate mail service

    // Have to change the listing alumni
  } catch (error) {
    return res.status(500).json({ message: `FAiled ${action}` });
  }
});
router.post("/action/alumni", async (req, res) => {
  try {
    const { action, userId } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(action)) {
      return res.status(400).json({ message: "Action not allowed" });
    }

    const updatedAlumni = await prisma.alumniProfile.update({
      where: { userId },
      data: {
        status: action,
      },
      include: { user: {
        select: {
            username: true,
            profileImage: true
        }
      } },
    });
    return res.status(201).json(updatedAlumni);

    // Integrate mail service
  } catch (error) {
    return res.status(500).json({ message: `Failed ${action}` });
  }
});
router.get("/history", async(_,res) => {
    try {
        const students = await prisma.studentProfile.findMany({
            where: {
                NOT: {
                    status: "PENDING"
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                }
            }
        })

        const alumnis = await prisma.alumniProfile.findMany({
            where: {
                NOT: {
                    status: "PENDING"
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                }
            }
        })

       return res.status(200).json([
            ...students.map(s => ({ ...s, type: 'student' })),
            ...alumnis.map(a => ({ ...a, type: 'alumni' }))
          ]);
    } catch (error) {
        return res.status(500).json({message: "Failed to get history please try again"})
    }
})

export default router;
