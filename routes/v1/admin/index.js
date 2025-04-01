import { Router } from "express";

import { prisma } from "../../../libs/prisma.js";
const router = Router();

router.get("/", (_, res) => {
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
            id: true,
            username: true,
            profileImage: true,
            email: true
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
            id: true,
            username: true,
            profileImage: true,
            email: true
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
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            email: true
          },
        },
      },
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
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
    return res.status(201).json(updatedAlumni);

    // Integrate mail service
  } catch (error) {
    return res.status(500).json({ message: `Failed ${action}` });
  }
});

router.get("/history", async (_, res) => {
  try {
    const students = await prisma.studentProfile.findMany({
      where: {
        NOT: {
          status: "PENDING",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            email: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const alumnis = await prisma.alumniProfile.findMany({
      where: {
        NOT: {
          status: "PENDING",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            email: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json([
        ...students.map((s) => ({ ...s, type: "student" })),
        ...alumnis.map((a) => ({ ...a, type: "alumni" })),
      ]);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to get history please try again",
        error: error.message,
        e: error,
      });
  }
});

// Total alumni and total student count
// Caching here
// no Total pending requests
// Total alumnis , total students ,
router.get("/count", async (_, res) => {
  try {
    const studentCount = await prisma.studentProfile.count({
      where: {
        NOT: {
          OR: [{ status: "PENDING" }, { status: "REJECTED" }],
        },
      },
    });

    const alumniCount = await prisma.alumniProfile.count({
      where: {
        NOT: {
          OR:[{status:"PENDING"},{status:"REJECTED"}]
        },
      },
    });

    const pendingStudents = await prisma.studentProfile.count({
      where: {
        status: "PENDING",
      },
    });

    const pendingAlumni = await prisma.alumniProfile.count({
      where: {
        status: "PENDING",
      },
    });

    return res
      .status(200)
      .json({
        pendingRequests: pendingStudents + pendingAlumni,
        studentCount,
        alumniCount,
      });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get count" });
  }
});
// Add alumni or student (isAlumni)
router.post("/add", async (req, res) => {
  try {
    const {
      username,
      email,
      isAlumni,
      enrolmentNumber,
      name,
      dob,
      course,
      batch,
    } = req.body;

    const alreadyUserWithEmailAndUsername = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (alreadyUserWithEmailAndUsername) {
      return res
        .status(400)
        .json({ message: "User already exists with same email or username" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: enrolmentNumber,
        role: isAlumni ? "ALUMNI" : "STUDENT",
      },
    });

    if (isAlumni) {
      await prisma.alumniProfile.create({
        data: {
          userId: user.id,
          status: "PENDING",
          name,
          DOB: dob,
          course,
          enrolmentNumber,
          batch,
        },
      });
    } else {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          status: "PENDING",
          name,
          DOB: dob,
          course,
          enrolmentNumber,
          batch,
        },
      });
    }
    return res.status(201).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add user", error: error.message, e: error });
  }
});

//add crousel

export default router;
