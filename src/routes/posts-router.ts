import {Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {
    createCommentValidation,
    createPostValidation, deletePostValidation, getCommentByPostIdValidation,
    getPostsValidation,
    getPostValidation,
    updatePostValidation
} from "../middlewares/validators";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../types/types";
import {TypePostQueryModel} from "../models/PostQueryModel";
import {TypePostInputModel} from "../models/PostInputModel";
import {TypePostUpdateModel} from "../models/PostUpdateModel";
import {TypePostViewModelPage} from "../models/PostViewModelPage";
import {TypePostViewModel} from "../models/PostViewModel";
import {TypeCommentInputModel} from "../models/CommentInputModel";
import {TypeCommentViewModel} from "../models/CommentViewModel";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepo} from "../repositories/comments-queryRepo";
import {TypeCommentViewModelPage} from "../models/CommentViewModelPage";
export const postsRouter = Router({});

postsRouter.get("/", getPostsValidation, async (req: RequestWithQuery<TypePostQueryModel>, res: Response<TypePostViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await postsQueryRepo.findPosts(+pageNumber, +pageSize, sortBy, sortDirection))
})
postsRouter.get("/:id", getPostValidation, async (req: RequestWithParam, res: Response<TypePostViewModel>) => {
    const foundPost = await postsQueryRepo.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundPost)
    }
})
postsRouter.post("/", createPostValidation, async (req: RequestWithBody<TypePostInputModel>, res: Response<TypePostViewModel>) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        if (createdPost) res.status(201).json(createdPost)
    }
})
postsRouter.put("/:id", updatePostValidation, async (req: RequestWithParamAndBody<TypePostUpdateModel>, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!isUpdatedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
postsRouter.get("/:id/comments", getCommentByPostIdValidation, async (req: RequestWithParamAndQuery<TypePostQueryModel>, res: Response<TypeCommentViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    const foundComments = await commentsQueryRepo.findCommentsByPostId(req.params.id, +pageNumber, +pageSize, sortBy, sortDirection)
    if (!foundComments) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundComments)
    }
})
postsRouter.post("/:id/comments", createCommentValidation, async (req: RequestWithParamAndBody<TypeCommentInputModel>, res: Response<TypeCommentViewModel>) => {
    const createdCommentId = await commentsService.createComment(req.params.id, req.body.content, req.userId)
    if (!createdCommentId) {
        return res.sendStatus(404)
    } else {
        const createdComment = await commentsQueryRepo.findCommentById(createdCommentId);
        if (createdComment) return res.status(201).json(createdComment)
    }
})
postsRouter.delete("/:id", deletePostValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedPost = await postsService.deletePost(req.params.id)
    if (!isDeletedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})