import {BlogsQueryRepo} from "../repositories/blogs-queryRepo";
import {BlogsService} from "../domain/blogs-service";
import {PostsQueryRepo} from "../../posts/repositories/posts-queryRepo";
import {PostsService} from "../../posts/domain/posts-service";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../../main/types/types";
import {BlogQueryModelType} from "../models/BlogQueryModel";
import {Response} from "express";
import {TypeBlogViewModelPage} from "../models/BlogViewModelPage";
import {BlogViewModelType} from "../models/BlogViewModel";
import {HTTP_Status} from "../../main/types/enums";
import {BlogInputModelType} from "../models/BlogInputModel";
import {BlogUpdateModelType} from "../models/BlogUpdateModel";
import {TypePostViewModelPage} from "../../posts/models/PostViewModelPage";
import {BlogPostInputModelType} from "../models/BlogPostInputModel";
import {PostViewModelType} from "../../posts/models/PostViewModel";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsQueryRepo) protected blogsQueryRepo: BlogsQueryRepo,
                @inject(BlogsService) protected blogsService: BlogsService,
                @inject(PostsQueryRepo) protected postsQueryRepo: PostsQueryRepo,
                @inject(PostsService) protected postsService: PostsService) {
    }

    async getBlogs(req: RequestWithQuery<BlogQueryModelType>, res: Response<TypeBlogViewModelPage>) {
        res.json(await this.blogsQueryRepo.findBlogs({
            searchNameTerm: req.query.searchNameTerm,
            pageNumber: +req.query.pageNumber,
            pageSize: +req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        }))
    }

    async getBlog(req: RequestWithParam, res: Response<BlogViewModelType>) {
        const foundBlog = await this.blogsQueryRepo.findBlogById(req.params.id);
        if (!foundBlog) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundBlog)
        }
    }

    async createBlog(req: RequestWithBody<BlogInputModelType>, res: Response<BlogViewModelType>) {
        const createdBlogId = await this.blogsService.createBlog({
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        });
        const createdBlog = await this.blogsQueryRepo.findBlogById(createdBlogId);
        if (createdBlog) res.status(HTTP_Status.CREATED_201).json(createdBlog)
    }

    async updateBlog(req: RequestWithParamAndBody<BlogUpdateModelType>, res: Response) {
        const isUpdatedBlog = await this.blogsService.updateBlog(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        });
        if (!isUpdatedBlog) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }

    async getPostsForBlog(req: RequestWithParamAndQuery<BlogQueryModelType>, res: Response<TypePostViewModelPage>) {
        const foundBlog = await this.postsQueryRepo.findPostsByBlogId({
            blogId: req.params.id,
            pageNumber: +req.query.pageNumber,
            pageSize: +req.query.pageSize,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection
        })
        if (!foundBlog) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundBlog)
        }
    }

    async createPostForBlog(req: RequestWithParamAndBody<BlogPostInputModelType>, res: Response<PostViewModelType>) {
        const createdPostId = await this.postsService.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.id
        })
        if (!createdPostId) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            const createdPost = await this.postsQueryRepo.findPostById(createdPostId)
            if (createdPost) res.status(HTTP_Status.CREATED_201).json(createdPost)
        }
    }

    async deleteBlog(req: RequestWithParam, res: Response) {
        const isDeletedBlog = await this.blogsService.deleteBlog(req.params.id);
        if (!isDeletedBlog) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }
}