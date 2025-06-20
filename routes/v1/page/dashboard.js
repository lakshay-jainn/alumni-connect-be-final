import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";
const router = Router();
router.get("/notif",async (req,res)=>{
    const userId = req.user.id;
    const role = req.user.role;
    try{
        const notifs = await prisma.notification.findMany({
            where:{
                userId:userId,
            },
            orderBy:{
                createdAt:"desc"
            }
        })
    return res.status(200).json(notifs);
    } catch (e) {
        res.status(500).json({ message: "Failed to get notifications" , e: e.message , error: e});
    }
})
router.post("/del-notif",async (req,res)=>{
    const userId = req.user.id;
    const notifId = req.body.notifId;
    console.log(req);
    try{
        const notifs = await prisma.notification.delete({
            where:{
                id:notifId,
            }
        })
    return res.status(200).json(notifs);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Failed to delete notification" , e: e.message , error: e});
    }
})
router.get("/", async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    
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
                userId,
            },
            select: {
                basic: true,
                batch: true,
                user: {
                    select: {
                        profileImage: true,
                    }
                }
            },
        }); 


        const profile = {
            role,
            firstName: userProfile.basic.firstName,
            lastName: userProfile.basic.lastName,
            course: userProfile.basic.course,
            courseSpecialization: userProfile.basic.courseSpecialization,
            batch: userProfile.batch,
            profileImage: userProfile.user.profileImage,
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