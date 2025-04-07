import {Router} from "express";
import {prisma} from "../../../libs/prisma.js";

const router = Router();

router.get("/",async (req,res) => {

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
                        id: userId
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        profileImage: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.status(200).json(alumnis)
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Unable to get alumni"
        })
    }
})
export default router;