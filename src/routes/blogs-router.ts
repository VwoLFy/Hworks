import {Response, Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {BlogsQueryRepo} from "../repositories/blogs-queryRepo";
import {PostsQueryRepo} from "../repositories/posts-queryRepo";
import {PostsService} from "../domain/posts-service";
import {
    RequestWithBody,
    RequestWithParam,
    RequestWithParamAndBody,
    RequestWithParamAndQuery,
    RequestWithQuery
} from "../types/types";
import {BlogInputModelType} from "../models/BlogInputModel";
import {BlogPostInputModelType} from "../models/BlogPostInputModel";
import {BlogQueryModelType} from "../models/BlogQueryModel";
import {BlogUpdateModelType} from "../models/BlogUpdateModel";
import {TypeBlogViewModelPage} from "../models/BlogViewModelPage";
import {BlogViewModelType} from "../models/BlogViewModel";
import {PostViewModelType} from "../models/PostViewModel";
import {TypePostViewModelPage} from "../models/PostViewModelPage";
import {HTTP_Status} from "../types/enums";
import {
    createBlogValidation,
    createPostsByBlogIdValidation,
    deleteBlogValidation, getBlogsValidation, getBlogValidation, getPostsByBlogIdValidation,
    updateBlogValidation
} from "../middlewares/blog-validators";

export const blogsRouter = Router({});

class BlogsController {
    private blogsQueryRepo: BlogsQueryRepo;
    private blogsService: BlogsService;
    private postsQueryRepo: PostsQueryRepo;
    private postsService: PostsService;

    constructor() {
    this.blogsQueryRepo = new BlogsQueryRepo()
    this.blogsService = new BlogsService()
    this.postsQueryRepo = new PostsQueryRepo()
    this.postsService = new PostsService()
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

const blogsController = new BlogsController()

blogsRouter.get('/', getBlogsValidation, blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', getBlogValidation, blogsController.getBlog.bind(blogsController))
blogsRouter.post('/', createBlogValidation, blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', updateBlogValidation, blogsController.updateBlog.bind(blogsController))
blogsRouter.get('/:id/posts', getPostsByBlogIdValidation, blogsController.getPostsForBlog.bind(blogsController))
blogsRouter.post('/:id/posts', createPostsByBlogIdValidation, blogsController.createPostForBlog.bind(blogsController))
blogsRouter.delete('/:id', deleteBlogValidation, blogsController.deleteBlog.bind(blogsController))