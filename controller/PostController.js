import {
  createComment,
  createPost,
  getComments,
  getPosts,
  likeDislikeComment,
  likeDislikePost,
} from "../services/postService.js";

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
  let { skip, take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 15;
  try {
    const posts = await getPosts(userId, skip, take);
    return res.status(200).json({
      posts,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to fetch posts why i dont know",
      err: e,
      error: e.message,
    });
  }
}

export async function likeDislikePostController(req, res) {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const like = await likeDislikePost(userId, postId);

    return res.status(200).json(like);
  } catch (error) {
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
    const post = await createComment(userId, postId, content);
    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Not been able to comment sir",
    });
  }
}

export async function getCommentController(req, res) {
  const userId = req.user.id;
  const { postId, skip, take } = req.body;

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
