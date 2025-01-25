import { prisma } from "../libs/prisma.js";

export async function sendConnectionRequest(senderId, receiverId) {
  return await prisma.connection.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING",
    },
  });
}

export async function getPendingConneectionRequests(userId) {
  return await prisma.connection.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          //ask whatever you want here given already enough
          username: true,
          role: true,
          profileImage: true,
        },
      },
    },
  });
}

export async function respondToConnectionRequest(connectionId, status) {
  return await prisma.connection.update({
    where: {
      id: connectionId,
    },
    data: {
      status,
    },
  });
}

export async function getConnections(userId) {
  return await prisma.connection.findMany({
    where: {
      OR: [
        { senderId: userId, status: "ACCEPTED" },
        { receiverId: userId, status: "ACCEPTED" },
      ],
    },
    include: {
      sender: {
        select: {
          username: true,
          role: true,
          profileImage: true,
        },
      },
      receiver: {
        select: {
          username: true,
          role: true,
          profileImage: true,
        },
      },
    },
  });
}

export async function removeConnection(connectionId) {
  return await prisma.connection.delete({
    where: {
      id: connectionId,
    },
  });
}
