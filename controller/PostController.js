import { createNotif } from "../services/notifService.js";
import {
  createComment,
  createPost,
  getComments,
  getPosts,
  likeDislikeComment,
  likeDislikePost,
} from "../services/postService.js";
import { getConnections } from "../utils/connection.js";

export async function createPostController(req, res) {
  const { content, caption } = req.body;
  const userId = req.user.id;

  try {
    const post = await createPost(userId, content, caption);
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}

export async function getPostsController(req, res) {
  const userId = req.user.id;
  let { skip, take,communities,onlyConnections } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 15;
  let connectionIds = null;
  if(onlyConnections){
    try{
      const {followers,followings} = await getConnections(userId);
      connectionIds = [... new Set([...followers.map(follower => follower.senderId),...followings.map(following => following.receiverId)])]
      
    }
    catch(error){
      return res.status(500).json({
      message: error.message,
    });
    }
  }
  try {
    const posts = await getPosts(userId, skip, take,communities,connectionIds);
  
    return res.status(200).json({
      posts,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to fetch posts why i dont know",
      err: e,
      error: e.message,
    });
  }
}
export async function getPostbyIdController(req,res) {
  const { postId, skip, take } = req.params;
  const userId = req.user?.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        Community:{
              select:{
                name:true,
                description:true,
              }
            },
        user: {
          select: {
            username: true,
            profileImage: true,
            profile:{
              select:{
                basic:true
              }
            },
            
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await getComments(userId,postId, skip, take);

    const like = await prisma.postLike.findFirst({
      where: {
        postId,
        userId
      },
    });
    const isLiked = !!like;

    return res.status(200).json({ ...post, isLiked , comments });
  } catch (error) {
    return res.status(500).json({ erro: "Something went wrong ing" , error , e : error.message });
  }
}

export async function likeDislikePostController(req, res) {
  const likerId = req.user.id;
  const { postId } = req.body;
  try {
    const like = await likeDislikePost(likerId, postId);
    
    const userProfile = await prisma.profile.findUnique({
      where:{userId:likerId},
      select:{
        basic:true,
        user:{
          select:{
            profileImage:true
          }
        }
      }
    })
    
    if (like.isLiked){
      const name  = userProfile.basic.firstName + " " +(userProfile.basic.lastName ? userProfile.basic.lastName : "");
      createNotif([like.postUserId],name,"liked your post","",userProfile.user.profileImage,`/feed/${postId}`);
      // if (!notif) return res.status(500).json({error:"notification failed"}) ;
    }
    res.status(200).json(like);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      message: "Like failed try again later",
    });
  }
}

export async function getPostLikeController(req , res) {
    const {postId} = req.query
    try {
        const postLike = await prisma.postLike.findMany({
            where: {postId},
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                }
            }
        })
        return res.status(200).json({
            postLike
        })
    }catch(e) {
        return res.status(500).json({
            message: "Failed to get post likes"
        })
    }
}

export async function createCommentController(req, res) {
  const { content, postId } = req.body;
  const userId = req.user.id;

  try {
    const {comment,post} = await createComment(userId, postId, content);
    const name = post.user.profile.basic.firstName + " " +  (post.user.profile.basic.lastName??"")
    createNotif([post.userId],name,"commented on your post",content.slice(0,Math.min(content.length+1,40)) + ((content.length>40)?"...":""),post.user.profileImage,`/feed/${postId}`);
    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Not been able to comment sir",
    });
  }
}

export async function getCommentController(req, res) {
  const userId = req.user.id;
  let { postId, skip, take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 5;

  try {
    const comments = await getComments(userId, postId, skip, take);
    res.status(200).json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch comments",
    });
  }
}

export async function likeDislikeCommentController(req, res) {
  const userId = req.user.id;
  const { commentId } = req.body;

  try {
    const like = await likeDislikeComment(userId, commentId);
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({
      message: "Liked failed very badly please try again",
    });
  }
}
