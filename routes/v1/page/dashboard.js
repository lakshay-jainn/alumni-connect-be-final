import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";
const router = Router();

router.get("/", async (req, res) => {
    const userId = req.user.id;
    
    try {
        const connectionLength = await prisma.connection.count({
            where: {
                OR: [
                    { senderId: userId, status: "ACCEPTED" },
                    { receiverId: userId, status: "ACCEPTED" }
                ]
            }
        });

        const followerLength = await prisma.connection.count({
            where: {
                receiverId: userId,
                status: "ACCEPTED"
            }
        })

        const followingLength = await prisma.connection.count({
            where: {
                senderId: userId,
                status: "ACCEPTED"
            }
        })  

        const postLength = await prisma.post.count({
            where: {
                userId
            }
        });

        const upComingEvents = await prisma.events.findMany({
            take: 3,
            orderBy:{
                createdAt: "desc"
            }
        });
        
        const userProfile = await prisma.profile.findUnique({
            where: {
                userId
            },
            select: {
                basic: true,
                batch: true,
                role: true
            }
        }); 


        const profile = {
            role: userProfile.role,
            firstName: userProfile.basic.firstName,
            lastName: userProfile.basic.lastName,
            course: userProfile.basic.course,
            batch: userProfile.batch
        }

        const yourNetworks = {
            postLength,
            followerLength,
            followingLength,

        }

        return res.status(200).json({ connectionLength , yourNetworks ,upComingEvents, profile});
    } catch (e) {
        res.status(500).json({ message: "Failed to get dashboard" , e: e.message , error: e});
    }
}); 

export default router;