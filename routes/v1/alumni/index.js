import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";

const router = Router();
router.get("/search",async (req,res) =>{
  const userId = req.user.id;
  const { searchQuery = '' } = req.query;
  const skip = parseInt(req.query.skip) || 0;
  const take = parseInt(req.query.take) || 30;


  try {
    const alumnis = await prisma.$queryRaw`
      SELECT
        p.*,
        row_to_json(u)                       AS "user",
        COALESCE(we_arr.workExperience, '[]') AS "workExperience"
      FROM "Profile" p
      JOIN "User" u
        ON u.id = p."userId"
      LEFT JOIN LATERAL (
        SELECT json_agg(t) AS workExperience
        FROM (
          SELECT we.*
          FROM "workExperience" we
          WHERE we."userId" = p."userId"
          ORDER BY we."startDate" DESC
          LIMIT 1
        ) t
      ) we_arr ON TRUE
      WHERE
        p.status = 'ACCEPTED'
        AND u.role = 'ALUMNI'
        AND u.id   != ${userId}
        AND (
          -- FIRST NAME
          lower(${searchQuery}) LIKE '%' || lower(p.basic->>'firstName') || '%'
          OR p.basic->>'firstName' ILIKE '%' || ${searchQuery} || '%'

          -- LAST NAME
          OR lower(${searchQuery}) LIKE '%' || lower(p.basic->>'lastName') || '%'
          OR p.basic->>'lastName' ILIKE '%' || ${searchQuery} || '%'

          -- COURSE
          OR lower(${searchQuery}) LIKE '%' || lower(p.basic->>'course') || '%'
          OR p.basic->>'course' ILIKE '%' || ${searchQuery} || '%'

          -- COURSE SPECIALIZATION
          OR lower(${searchQuery}) LIKE '%' || lower(p.basic->>'courseSpecialization') || '%'
          OR p.basic->>'courseSpecialization' ILIKE '%' || ${searchQuery} || '%'

          -- WORK EXPERIENCE (organisation + designation)
          OR EXISTS (
            SELECT 1
            FROM "workExperience" we2
            WHERE we2."userId" = p."userId"
              AND (
                lower(${searchQuery}) LIKE '%' || lower(we2.organisation) || '%'
                OR we2.organisation ILIKE '%' || ${searchQuery} || '%'
                OR lower(${searchQuery}) LIKE '%' || lower(we2.designation) || '%'
                OR we2.designation ILIKE '%' || ${searchQuery} || '%'
              )
          )
        )
      OFFSET ${skip}
      LIMIT  ${take};
    `

const structuredAlumniData = alumnis
.filter((alumni) => {
  if (alumni.workExperience.length>0 && alumni.basic.course) {
    return true;
  } else {
    return false;
  }
})
.map((alumni) => {
  return {
    id: alumni.userId,
    name: (alumni.basic.firstName || "" ) + "" + (alumni.basic.lastName || ""),
    jobtitle: alumni.workExperience[0].designation || "",
    company: alumni.workExperience[0].organisation || "",
    course: (alumni.basic.course || "") + "" + (alumni.basic.courseSpecialization || ""),
    batch: alumni.batch || "",
    img: alumni.user.profileImage + "",
  };
});
console.log(structuredAlumniData);
res.status(200).json(structuredAlumniData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err });
  }
})
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
        workExperience: {
            orderBy: {
              startDate: 'desc'  // or 'endDate' or 'createdAt' depending on what field you have
            },
            take: 1
          }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    const structuredAlumniData = alumnis
      .filter((alumni) => {
        if (alumni.workExperience.length>0 && alumni.basic.course) {
          return true;
        } else {
          return true;
        }
      })
      .map((alumni) => {
        return {
          id: alumni.userId,
          name: (alumni.basic.firstName || "" ) + "" + (alumni.basic.lastName || ""),
          jobtitle: alumni.workExperience[0].designation || "",
          company: alumni.workExperience[0].organisation || "",
          course: (alumni.basic.course || "") + "" + (alumni.basic.courseSpecialization || ""),
          batch: alumni.batch || "",
          img: alumni.user.profileImage + "",
        };
      });
   
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

  const userId = req.user.id;
  const { id } = req.params;
  let connection = await prisma.connection.findUnique({
      where:{
        senderId_receiverId: {
          senderId: userId,
          receiverId:id
        }
      },
      select:{
        status:true,
      }
    })

  if(!connection || connection.status == "REJECTED"){
      connection = {status:"CONNECT"}
  }
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
        workExperience:{
          orderBy:{
            startDate:"desc"
          }
        }
      },
    });

    const { enrollmentNumber, profileCompletionPercentage, ...other } = alumni;

    res.status(200).json({...other,connectionStatus:connection.status});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      e: error,
      error: error.message,
      message: "Unable to get the alumni alumni",
    });
  }
});
export default router;
