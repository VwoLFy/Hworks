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
} from "../types";
import {TypeBlogInputModel} from "../models/BlogInputModel";
import {TypeBlogPostInputModel} from "../models/BlogPostInputModel";
import {TypeBlogQueryModel} from "../models/BlogQueryModel";
import {TypeBlogUpdateModel} from "../models/BlogUpdateModel";
import {
    createBlogValidation,
    createPostsByBlogIdValidation,
    getBlogValidation,
    getBlogsValidation,
    getPostsByBlogIdValidation, updateBlogValidation, deleteBlogValidation
} from "../middlewares/validators";
import {TypeBlogViewModelPage} from "../models/BlogViewModelPage";
import {TypeBlogViewModel} from "../models/BlogViewModel";
import {TypePostViewModel} from "../models/PostViewModel";
import {TypePostViewModelPage} from "../models/PostViewModelPage";
export const blogsRouter = Router({});

export enum SortDirection {
    asc = "asc",
    desc = "desc"
}

blogsRouter.get('/', getBlogsValidation, async (req: RequestWithQuery<TypeBlogQueryModel>, res: Response<TypeBlogViewModelPage>) => {
    const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await blogsQueryRepo.findBlogs(searchNameTerm, +pageNumber, +pageSize, sortBy, sortDirection))
})
blogsRouter.get('/:id', getBlogValidation, async (req: RequestWithParam, res: Response) => {
    const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.get('/:id/posts', getPostsByBlogIdValidation, async (req: RequestWithParamAndQuery<TypeBlogQueryModel>, res: Response<TypePostViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query

    const foundBlog = await postsQueryRepo.findPostsByBlogId(req.params.id, +pageNumber, +pageSize, sortBy, sortDirection);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.post('/:id/posts', createPostsByBlogIdValidation, async (req: RequestWithParamAndBody<TypeBlogPostInputModel>, res: Response<TypePostViewModel>) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        if (createdPost) res.status(201).json(createdPost)
    }
})
blogsRouter.post('/', createBlogValidation, async (req: RequestWithBody<TypeBlogInputModel>, res: Response<TypeBlogViewModel>) => {
    const createdBlogId = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
    if (createdBlog) res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', updateBlogValidation, async (req: RequestWithParamAndBody<TypeBlogUpdateModel>, res: Response) => {
    const isUpdatedBlog = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    if (!isUpdatedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
blogsRouter.delete('/:id', deleteBlogValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})