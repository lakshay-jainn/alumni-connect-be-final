import { prisma } from "../libs/prisma.js";
    export async function listAllAlumniController(req, res) {
        try {
          const alumniProfiles = await prisma.alumniProfile.findMany({
            // include: {
            //   user: true, // if need the assosiated user details 
            // },
          });
          res.status(200).json({
            success: true,
            message: "Alumni profiles fetched successfully",
            data: alumniProfiles,
          });
        } catch (error) {
          console.log("Error fetching alumni profiles:", error);
          res.status(500).json({
            success: false,
            message: "Failed to retrieve alumni profiles",
            error: error.message,
          });
        }
}