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

    res.status(200).json({response, message: "Pending requests fetched successfully"});
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
    return res.status(201).json({updatedStudent, message: "Action Performed successfully"});

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
    return res.status(201).json({updatedAlumni, message: "Action Performed successfully"});

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
    return res.status(201).json({user, message: "user added successfully"});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add user", error: error.message, e: error });
  }
});

router.post("/event", async (req, res) => {
  try {
    const { title, description, time, location, importantLinks,eventImage,eventData  } = req.body;

    const event = await prisma.events.create({
      data: {
        title,
        description,
        time,
        location,
        importantLinks,
        eventImage,
        eventData
      },
    });

    return res.status(201).json({event, message: "Event added successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to add event" , error:error.message ,e : error});
  }
});

router.get("/event", async (_, res) => {
  try {
    const events = await prisma.events.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({events, message: "Events fetched successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to get events", error, e: error.message });
  }
});

router.delete("/event/delete", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id)
    const event = await prisma.events.delete({
      where: {
        id
      },
    });
    return res.status(200).json({event, message: "Event deleted successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete event" , error:error.message ,e : error});
  }
});

router.patch("/event/edit", async (req, res) => {
  try {
    const { id, title, description, time, location, importantLinks,eventImage } = req.body;

    const event = await prisma.events.update({
      where: {
        id
      },
      data: {
        title,
        description,
        time,
        location,
        importantLinks,
        eventImage
      },
    });

    return res.status(200).json({event, message: "Event updated successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to update event" , error:error.message ,e : error});
  }
});
//add crousel
router.post("/crousel", async (req, res) => {
  try {
    const { image, name, description, batch } = req.body;

    const crousel = await prisma.crousel.create({
      data: {
        batch,
        name,
        description,
        image,
      },
    });
    return res.status(201).json({crousel, message: "Crousel added successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to add crousel" , error:error.message ,e : error});
  }
});

router.get("/crousel", async (_, res) => {
  try {
    const crousel = await prisma.crousel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({crousel, message: "Crousel fetched successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to get crousel" , error:error.message ,e : error});
  }
});

router.delete("/crousel/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const crousel = await prisma.crousel.delete({
      where: {
        id
      },
    });
    return res.status(200).json({crousel, message: "Crousel deleted successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete crousel" , error:error.message ,e : error});
  }
});

router.patch("/crousel/edit", async (req, res) => {
  try {
    const { id, image, name, description, batch } = req.body;

    const crousel = await prisma.crousel.update({
      where: {
        id
      },
      data: {
        batch,
        name,
        description,
        image,
      },
    });

    return res.status(200).json({crousel, message: "Crousel updated successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Failed to update crousel" , error:error.message ,e : error});
  }
});

export default router;
