import {PostsQueryRepo} from "../infrastructure/posts-queryRepo";
import {PostsService} from "../application/posts-service";
import {CommentsQueryRepo} from "../../comments/infrastructure/comments-queryRepo";
import {CommentsService} from "../../comments/application/comments-service";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../../main/types/types";
import {PostQueryModel} from "./models/PostQueryModel";
import {Response} from "express";
import {PostViewModelPage} from "./models/PostViewModelPage";
import {PostViewModel} from "./models/PostViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {PostInputModel} from "./models/PostInputModel";
import {PostUpdateModel} from "./models/PostUpdateModel";
import {CommentViewModelPage} from "../../comments/api/models/CommentViewModelPage";
import {CommentInputModel} from "../../comments/api/models/CommentInputModel";
import {CommentViewModel} from "../../comments/api/models/CommentViewModel";
import {inject, injectable} from "inversify";

@injectable()
export class PostController {
    constructor(@inject(PostsQueryRepo) protected postsQueryRepo: PostsQueryRepo,
                @inject(PostsService) protected postsService: PostsService,
                @inject(CommentsQueryRepo) protected commentsQueryRepo: CommentsQueryRepo,
                @inject(CommentsService) protected commentsService: CommentsService) {
    }

    async getPosts(req: RequestWithQuery<PostQueryModel>, res: Response<PostViewModelPage>) {
        res.json(await this.postsQueryRepo.findPosts({
            pageNumber: +req.query.pageNumber,
            pageSize: +req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }))
    }

    async getPost(req: RequestWithParam, res: Response<PostViewModel>) {
        const foundPost = await this.postsQueryRepo.findPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundPost)
        }
    }

    async createPost(req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) {
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

    async updatePost(req: RequestWithParamAndBody<PostUpdateModel>, res: Response) {
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

    async getCommentsForPost(req: RequestWithParamAndQuery<PostQueryModel>, res: Response<CommentViewModelPage>) {
        const userId = req.userId ? req.userId : null
        const foundComments = await this.commentsQueryRepo.findCommentsByPostId({
            postId: req.params.id,
            page: +req.query.pageNumber,
            pageSize: +req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            userId
        })
        if (!foundComments) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundComments)
        }
    }

    async createCommentForPost(req: RequestWithParamAndBody<CommentInputModel>, res: Response<CommentViewModel>) {
        const createdCommentId = await this.commentsService.createComment({
            postId: req.params.id,
            content: req.body.content,
            userId: req.userId})
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