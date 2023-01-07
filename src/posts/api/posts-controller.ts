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
import {FindPostsQueryModel} from "./models/FindPostsQueryModel";
import {Response} from "express";
import {PostsViewModelPage} from "./models/PostsViewModelPage";
import {PostViewModel} from "./models/PostViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {CommentViewModelPage} from "../../comments/api/models/CommentViewModelPage";
import {CommentInputModel} from "../../comments/api/models/CommentInputModel";
import {CommentViewModel} from "../../comments/api/models/CommentViewModel";
import {inject, injectable} from "inversify";
import {CreatePostDto} from "../application/dto/CreatePostDto";
import {UpdatePostDto} from "../application/dto/UpdatePostDto";
import {FindCommentsQueryModel} from "./models/FindCommentsQueryModel";
import {PostLikeInputModel} from "./models/PostLikeInputModel";

@injectable()
export class PostController {
    constructor(@inject(PostsQueryRepo) protected postsQueryRepo: PostsQueryRepo,
                @inject(PostsService) protected postsService: PostsService,
                @inject(CommentsQueryRepo) protected commentsQueryRepo: CommentsQueryRepo,
                @inject(CommentsService) protected commentsService: CommentsService) {
    }

    async getPosts(req: RequestWithQuery<FindPostsQueryModel>, res: Response<PostsViewModelPage>) {
        const userId = req.userId ? req.userId : null
        res.json(await this.postsQueryRepo.findPosts({
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }, userId))
    }

    async getPost(req: RequestWithParam, res: Response<PostViewModel>) {
        const userId = req.userId ? req.userId : null
        const foundPost = await this.postsQueryRepo.findPostById(req.params.id, userId)
        if (!foundPost) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundPost)
        }
    }

    async createPost(req: RequestWithBody<CreatePostDto>, res: Response<PostViewModel>) {
        const createdPostId = await this.postsService.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        })
        if (!createdPostId) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            const createdPost = await this.postsQueryRepo.findPostById(createdPostId, req.userId)
            if (createdPost) res.status(HTTP_Status.CREATED_201).json(createdPost)
        }
    }

    async updatePost(req: RequestWithParamAndBody<UpdatePostDto>, res: Response) {
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

    async likePost(req: RequestWithParamAndBody<PostLikeInputModel>, res: Response) {
        const result = await this.postsService.likePost({
            postId: req.params.id,
            userId: req.userId,
            likeStatus: req.body.likeStatus
        })
        if (!result) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }

    async getCommentsForPost(req: RequestWithParamAndQuery<FindCommentsQueryModel>, res: Response<CommentViewModelPage>) {
        const userId = req.userId ? req.userId : null
        const foundComments = await this.commentsQueryRepo.findCommentsByPostId({
            postId: req.params.id,
            page: req.query.pageNumber,
            pageSize: req.query.pageSize,
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