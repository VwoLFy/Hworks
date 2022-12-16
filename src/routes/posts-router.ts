import {Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../types/types";
import {PostQueryModelType} from "../models/PostQueryModel";
import {PostInputModelType} from "../models/PostInputModel";
import {PostUpdateModelType} from "../models/PostUpdateModel";
import {TypePostViewModelPage} from "../models/PostViewModelPage";
import {PostViewModelType} from "../models/PostViewModel";
import {CommentInputModelType} from "../models/CommentInputModel";
import {CommentViewModelType} from "../models/CommentViewModel";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepo} from "../repositories/comments-queryRepo";
import {TypeCommentViewModelPage} from "../models/CommentViewModelPage";
import {HTTP_Status} from "../types/enums";
import {
    createPostValidation,
    deletePostValidation, getPostsValidation,
    getPostValidation,
    updatePostValidation
} from "../middlewares/post-validators";
import {createCommentValidation, getCommentByPostIdValidation} from "../middlewares/comment-validators";
export const postsRouter = Router({});

postsRouter.get("/", getPostsValidation, async (req: RequestWithQuery<PostQueryModelType>, res: Response<TypePostViewModelPage>) => {
    res.json(await postsQueryRepo.findPosts({
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
    }))
})
postsRouter.get("/:id", getPostValidation, async (req: RequestWithParam, res: Response<PostViewModelType>) => {
    const foundPost = await postsQueryRepo.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.status(HTTP_Status.OK_200).json(foundPost)
    }
})
postsRouter.post("/", createPostValidation, async (req: RequestWithBody<PostInputModelType>, res: Response<PostViewModelType>) => {
    const createdPostId = await postsService.createPost({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    })
    if (!createdPostId) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        if (createdPost) res.status(HTTP_Status.CREATED_201).json(createdPost)
    }
})
postsRouter.put("/:id", updatePostValidation, async (req: RequestWithParamAndBody<PostUpdateModelType>, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    })
    if (!isUpdatedPost) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})
postsRouter.get("/:id/comments", getCommentByPostIdValidation, async (req: RequestWithParamAndQuery<PostQueryModelType>, res: Response<TypeCommentViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    const foundComments = await commentsQueryRepo.findCommentsByPostId(req.params.id, +pageNumber, +pageSize, sortBy, sortDirection)
    if (!foundComments) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.status(HTTP_Status.OK_200).json(foundComments)
    }
})
postsRouter.post("/:id/comments", createCommentValidation, async (req: RequestWithParamAndBody<CommentInputModelType>, res: Response<CommentViewModelType>) => {
    const createdCommentId = await commentsService.createComment(req.params.id, req.body.content, req.userId)
    if (!createdCommentId) {
        return res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        const createdComment = await commentsQueryRepo.findCommentById(createdCommentId);
        if (createdComment) return res.status(HTTP_Status.CREATED_201).json(createdComment)
    }
})
postsRouter.delete("/:id", deletePostValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedPost = await postsService.deletePost(req.params.id)
    if (!isDeletedPost) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})