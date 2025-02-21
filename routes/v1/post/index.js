import {Router} from "express"
import { createCommentController, createPostController, getCommentController, getPostsController , likeDislikeCommentController, likeDislikePostController , } from "../../../controller/PostController.js"

const router = Router()

router.post("/create-post",createPostController)
router.get("/posts", getPostsController)
router.post("/like-post", likeDislikePostController)
router.post("/create-comment",createCommentController)
router.post("/comments", getCommentController)
router.post("/like-comment",likeDislikeCommentController)



export default router