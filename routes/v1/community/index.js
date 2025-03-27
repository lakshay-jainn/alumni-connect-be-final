import { Router } from "express";
import { prisma } from "../../../libs/prisma.js";
import {checkForAuthentication} from "../../../middlewares/auth.js";
const router = Router();

//Get all communities
router.get("/communities", async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.json(communities);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


// Get all posts of A community (loggedout)
router.get("/:id/feeds", async (req, res) => {
  const { id } = req.params;
  let { skip , take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 15;
  try {
    const posts = await prisma.post.findMany({
      skip,
      take,
      where: {
        communityId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sorting baby
      },
    });
    // if (!posts) {
    //   return res.status(404).json({ error: "Post not found" });
    // }

    res.status(200).json(
    {posts: posts.map((post) => {
        const { likes, ...rest } = post; // Destructure `likes` and keep the rest of the post data
        return {
          ...rest,
          isLiked: false, // Add `isLiked` flag
        };
      })}
    );

    //   res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all posts of a community (loggedin)
router.get("/:id/posts", checkForAuthentication ,async (req, res) => {
  const { id } = req.params;
  let { skip , take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 15;

  const userId = req.user?.id;
  try {
    const posts = await prisma.post.findMany({
      skip,
      take,
      where: {
        communityId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sorting baby
      },
    });
    // if (!posts) {
    //   return res.status(404).json({ error: "Post not found" });
    // }

    res.status(200).json(
    {posts: posts.map((post) => {
        const { likes, ...rest } = post; // Destructure `likes` and keep the rest of the post data
        return {
          ...rest,
          isLiked: likes.length > 0, // Add `isLiked` flag
        };
      })}
    );

    //   res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


//Create a community with a post
router.post("/post",checkForAuthentication, async (req, res) => {
  const userId = req.user.id;
  const { communityId, content, caption } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        caption,
        userId,
        communityId,
      },
    });

    res.status(200).json({
      message: "Post created successfully",
      post,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
});

// join a community
router.post("/:communityId/join",checkForAuthentication, async (req, res) => {
  const userId = req.user.id;

  const { communityId } = req.params;

  try {
    //already joined a community
    const exsistingCommunity = await prisma.community.findFirst({
      where: {
        id: communityId,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (exsistingCommunity) {
      return res.status(400).json({
        message: "Already joined the community",
      });
    }

    const community = await prisma.community.update({
      where: {
        id: communityId,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.json({
      message: "Joined community successfully",
      community,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to join community",
    });
  }
});

// leave a community
router.post("/:communityId/leave",checkForAuthentication, async (req, res) => {
  const userId = req.user.id;
  const{communityId} = req.params;

  try{
    const community = await prisma.community.update({
      where: {
        id: communityId,
      },
      data:{
        members:{
          disconnect:{
            id:userId
          }
        }
      }
    })
    res.json({ message: 'User left the community successfully', community });

  }
  catch(e){
    return res.status(500).json({
      message: "Failed to leave community",
    });
  }
})

//get all communites a user has joined
router.get("/:userId/joined",checkForAuthentication, async (req, res) => {
  const { userId } = req.params;

  try{
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      include:{
        communities:true
      }
    })

    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json(user.communities);
  }
  catch(e){
    return res.status(500).json({
      message: "Failed to get user's joined communities",
    });
  }
})

export default router;
