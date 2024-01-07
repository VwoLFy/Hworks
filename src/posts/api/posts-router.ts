import {Router} from "express";
import {
    createPostValidation,
    deletePostValidation,
    getPostsValidation,
    getPostValidation, likePostValidation,
    updatePostValidation
} from "../../main/middlewares/post-validators";
import {createCommentValidation, getCommentsByPostIdValidation} from "../../main/middlewares/comment-validators";
import {container} from "../../main/composition-root";
import {PostController} from "./posts-controller";

const postController = container.resolve(PostController)

export const postsRouter = Router({});

postsRouter.get("/", getPostsValidation, postController.getPosts.bind(postController))
postsRouter.get("/:id", getPostValidation, postController.getPost.bind(postController))
postsRouter.post("/", createPostValidation, postController.createPost.bind(postController))
postsRouter.put("/:id", updatePostValidation, postController.updatePost.bind(postController))
postsRouter.get("/:id/comments", getCommentsByPostIdValidation, postController.getCommentsForPost.bind(postController))
postsRouter.post("/:id/comments", createCommentValidation, postController.createCommentForPost.bind(postController))
postsRouter.put("/:id/like-status", likePostValidation, postController.likePost.bind(postController))
postsRouter.delete("/:id", deletePostValidation, postController.deletePost.bind(postController))