import {Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {postsService} from "../domain/posts-service";
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

blogsRouter.get('/', getBlogsValidation, async (req: RequestWithQuery<BlogQueryModelType>, res: Response<TypeBlogViewModelPage>) => {
    res.json(await blogsQueryRepo.findBlogs({
        searchNameTerm: req.query.searchNameTerm,
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
    }))
})
blogsRouter.get('/:id', getBlogValidation, async (req: RequestWithParam, res: Response<BlogViewModelType>) => {
    const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.status(HTTP_Status.OK_200).json(foundBlog)
    }
})
blogsRouter.post('/', createBlogValidation, async (req: RequestWithBody<BlogInputModelType>, res: Response<BlogViewModelType>) => {
    const createdBlogId = await blogsService.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    });
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
    if (createdBlog) res.status(HTTP_Status.CREATED_201).json(createdBlog)
})
blogsRouter.put('/:id', updateBlogValidation, async (req: RequestWithParamAndBody<BlogUpdateModelType>, res: Response) => {
    const isUpdatedBlog = await blogsService.updateBlog(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    });
    if (!isUpdatedBlog) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})
blogsRouter.get('/:id/posts', getPostsByBlogIdValidation, async (req: RequestWithParamAndQuery<BlogQueryModelType>, res: Response<TypePostViewModelPage>) => {
    const foundBlog = await postsQueryRepo.findPostsByBlogId({
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
})
blogsRouter.post('/:id/posts', createPostsByBlogIdValidation, async (req: RequestWithParamAndBody<BlogPostInputModelType>, res: Response<PostViewModelType>) => {
    const createdPostId = await postsService.createPost({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.params.id
    })
    if (!createdPostId) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        if (createdPost) res.status(HTTP_Status.CREATED_201).json(createdPost)
    }
})
blogsRouter.delete('/:id', deleteBlogValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})