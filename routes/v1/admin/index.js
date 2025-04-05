import { Router } from "express";

import { prisma } from "../../../libs/prisma.js";

const router = Router();

router.get("/", (_, res) => {
  return res.json({ message: "welcome admin" });
});

router.get("/pending", async (_, res) => {
  try {
    const data = await prisma.profile.findMany({
      where: {
        AND: [
          { status: "PENDING" },
          {
            user: {
              role: { not: "ADMIN" },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const resData = data.map((profile) => {
      return {
        ...profile,
        type: profile.user.role,
      };
    });

    res.status(200).json(resData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Falied unexpectdly", error: error.message, e: error });
  }
});

router.post("/action", async (req, res) => {
  try {
    const { action, userId } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(action)) {
      return res.status(400).json({ message: "Action not allowed" });
    }

    const update = await prisma.profile.update({
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
            email: true,
          },
        },
      },
    });
    return res
      .status(201)
      .json({ update, message: "Action Performed successfully" });
  } catch (error) {
    return res.status(500).json({ message: `FAiled ${action}` });
  }
});

router.get("/history", async (_, res) => {
  try {
    const profile = await prisma.profile.findMany({
      where: {
        status: {
          not: "PENDING",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const resData = profile.map((profile) => {
      return {
        ...profile,
        type: profile.user.role,
      };
    });

    return res.status(200).json(resData);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get history please try again",
      error: error.message,
      e: error,
    });
  }
});

router.get("/count", async (_, res) => {
  try {
    const studentCount = await prisma.profile.count({
      where: {
        role: "STUDENT",
        status: {
          in: ["ACCEPTED"],
        },
      },
    });

    const alumniCount = await prisma.profile.count({
      where: {
        role: "ALUMNI",
        status: {
          in: ["ACCEPTED"],
        },
      },
    });

    const pendings = await prisma.profile.count({
      where: {
        role: {
          in: ["STUDENT", "ALUMNI"],
        },
        status: "PENDING",
      },
    });

    return res.status(200).json({
      pendingRequests: pendings,
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
        email,
        isAlumni,
        enrolmentNumber,
        batch,
        firstName,
        lastName,
        gender,
        course,
        startYear,
        endYear,
    } = req.body;

    const alreadyUser = await prisma.user.findFirst({
      where: {
        email
      },
    });

    if (alreadyUser) {
      return res
        .status(400)
        .json({ message: "User already exists with same email or username" });
    }

    const user = await prisma.user.create({
      data: {
        username: enrolmentNumber,
        email,
        password: enrolmentNumber,
        role: isAlumni ? "ALUMNI" : "STUDENT",
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        status: "ACCEPTED",
        enrolmentNumber,
        batch,
        basic: {
          firstName,
          lastName,
          gender,
          course,
          courseDuration: {
            startYear,
            endYear,
          },
        },
      },
    });
    return res.status(201).json({ user, message: "user added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add user", error: error.message, e: error });
  }
});

router.post("/event", async (req, res) => {
  try {
    const {
      title,
      description,
      time,
      location,
      importantLinks,
      eventImage,
      eventData,
    } = req.body;

    const event = await prisma.events.create({
      data: {
        title,
        description,
        time,
        location,
        importantLinks,
        eventImage,
        eventData,
      },
    });

    return res.status(201).json({ event, message: "Event added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add event", error: error.message, e: error });
  }
});

router.get("/event", async (_, res) => {
  try {
    const events = await prisma.events.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(200)
      .json({ events, message: "Events fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get events", error, e: error.message });
  }
});

router.delete("/event/delete", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const event = await prisma.events.delete({
      where: {
        id,
      },
    });
    return res
      .status(200)
      .json({ event, message: "Event deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to delete event",
        error: error.message,
        e: error,
      });
  }
});

router.patch("/event/edit", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      time,
      location,
      importantLinks,
      eventImage,
    } = req.body;

    const event = await prisma.events.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        time,
        location,
        importantLinks,
        eventImage,
      },
    });

    return res
      .status(200)
      .json({ event, message: "Event updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to update event",
        error: error.message,
        e: error,
      });
  }
});

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
    return res
      .status(201)
      .json({ crousel, message: "Crousel added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to add crousel",
        error: error.message,
        e: error,
      });
  }
});

router.get("/crousel", async (_, res) => {
  try {
    const crousel = await prisma.crousel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(200)
      .json({ crousel, message: "Crousel fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to get crousel",
        error: error.message,
        e: error,
      });
  }
});

router.delete("/crousel/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const crousel = await prisma.crousel.delete({
      where: {
        id,
      },
    });
    return res
      .status(200)
      .json({ crousel, message: "Crousel deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to delete crousel",
        error: error.message,
        e: error,
      });
  }
});

router.patch("/crousel/edit", async (req, res) => {
  try {
    const { id, image, name, description, batch } = req.body;

    const crousel = await prisma.crousel.update({
      where: {
        id,
      },
      data: {
        batch,
        name,
        description,
        image,
      },
    });

    return res
      .status(200)
      .json({ crousel, message: "Crousel updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to update crousel",
        error: error.message,
        e: error,
      });
  }
});

export default router;
