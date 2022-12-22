import {PostsQueryRepo} from "../repositories/posts-queryRepo";
import {PostsService} from "../domain/posts-service";
import {CommentsQueryRepo} from "../repositories/comments-queryRepo";
import {CommentsService} from "../domain/comments-service";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../types/types";
import {PostQueryModelType} from "../models/PostQueryModel";
import {Response} from "express";
import {TypePostViewModelPage} from "../models/PostViewModelPage";
import {PostViewModelType} from "../models/PostViewModel";
import {HTTP_Status} from "../types/enums";
import {PostInputModelType} from "../models/PostInputModel";
import {PostUpdateModelType} from "../models/PostUpdateModel";
import {TypeCommentViewModelPage} from "../models/CommentViewModelPage";
import {CommentInputModelType} from "../models/CommentInputModel";
import {CommentViewModelType} from "../models/CommentViewModel";

export class PostController {
    constructor(protected postsQueryRepo: PostsQueryRepo,
                protected postsService: PostsService,
                protected commentsQueryRepo: CommentsQueryRepo,
                protected commentsService: CommentsService) {
    }

    async getPosts(req: RequestWithQuery<PostQueryModelType>, res: Response<TypePostViewModelPage>) {
        res.json(await this.postsQueryRepo.findPosts({
            pageNumber: +req.query.pageNumber,
            pageSize: +req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }))
    }

    async getPost(req: RequestWithParam, res: Response<PostViewModelType>) {
        const foundPost = await this.postsQueryRepo.findPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundPost)
        }
    }

    async createPost(req: RequestWithBody<PostInputModelType>, res: Response<PostViewModelType>) {
        const createdPostId = await this.postsService.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        })
        if (!createdPostId) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            const createdPost = await this.postsQueryRepo.findPostById(createdPostId)
            if (createdPost) res.status(HTTP_Status.CREATED_201).json(createdPost)
        }
    }

    async updatePost(req: RequestWithParamAndBody<PostUpdateModelType>, res: Response) {
        const isUpdatedPost = await this.postsService.updatePost(req.params.id, {
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
    }

    async getCommentsForPost(req: RequestWithParamAndQuery<PostQueryModelType>, res: Response<TypeCommentViewModelPage>) {
        const userId = req.userId ? req.userId : null
        const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
        const foundComments = await this.commentsQueryRepo.findCommentsByPostId(req.params.id, +pageNumber, +pageSize, sortBy, sortDirection, userId)
        if (!foundComments) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundComments)
        }
    }

    async createCommentForPost(req: RequestWithParamAndBody<CommentInputModelType>, res: Response<CommentViewModelType>) {
        const createdCommentId = await this.commentsService.createComment(req.params.id, req.body.content, req.userId)
        if (!createdCommentId) {
            return res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            const createdComment = await this.commentsQueryRepo.findCommentById(createdCommentId, req.userId);
            if (createdComment) return res.status(HTTP_Status.CREATED_201).json(createdComment)
        }
    }

    async deletePost(req: RequestWithParam, res: Response) {
        const isDeletedPost = await this.postsService.deletePost(req.params.id)
        if (!isDeletedPost) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }
}