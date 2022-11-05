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
export const blogsRouter = Router({});

export enum SortDirection {
    asc = "asc",
    desc = "desc"
}

blogsRouter.get('/', getBlogsValidation, async (req: RequestWithQuery<TypeBlogQueryModel>, res: Response) => {
    const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await blogsQueryRepo.findBlogs(searchNameTerm, +pageNumber, +pageSize, sortBy, sortDirection))
})
blogsRouter.get('/:id', getBlogValidation, async (req: RequestWithParam<{id: string}>, res: Response) => {
    const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.get('/:id/posts', getPostsByBlogIdValidation, async (req: RequestWithParamAndQuery<{id: string}, TypeBlogQueryModel>, res: Response) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query

    const foundBlog = await postsQueryRepo.findPostsByBlogId(req.params.id, +pageNumber, +pageSize, sortBy, sortDirection);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.post('/:id/posts', createPostsByBlogIdValidation, async (req: RequestWithParamAndBody<{id: string}, TypeBlogPostInputModel>,
                                                                                                                       res: Response) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        res.status(201).json(createdPost)
    }
})
blogsRouter.post('/', createBlogValidation, async (req: RequestWithBody<TypeBlogInputModel>, res: Response) => {
    const createdBlogId = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
    res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', updateBlogValidation, async (req: RequestWithParamAndBody<{id: string}, TypeBlogUpdateModel>, res: Response) => {
    const isUpdatedBlog = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    if (!isUpdatedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
blogsRouter.delete('/:id', deleteBlogValidation, async (req: RequestWithParam<{id: string}>, res: Response) => {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})