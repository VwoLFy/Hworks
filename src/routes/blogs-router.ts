import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body, query} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {postsService} from "../domain/posts-service";
import {listOfValidationPost} from "./posts-router";

export const blogsRouter = Router({});

enum SortDirection {
    asc = "asc",
    desc = "desc"
}
type ReqQuery = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
    .isString().trim().isLength({min: 1, max: 15});
const youtubeUrlValidation = body('youtubeUrl', "'youtubeUrl' must be a string in range from 1 to 100 symbols")
    .isString().trim().matches("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$").isLength({min: 1, max: 100});
const listOfValidationBlog = [nameValidation, youtubeUrlValidation, inputValidationMiddleware];
const queryValidation = [
    query('searchNameTerm').customSanitizer(value => {
        if (!value) return null;
        return value
    }),
    query('pageNumber').customSanitizer(value => {
        value = Number(value)
        if (!value) return 1;
        return value
    }),
    query('pageSize').customSanitizer(value => {
        value = Number(value)
        if (!value) return 10;
        return value
    }),
    query('sortBy').customSanitizer(value => {
        const fields = ['id', 'name', 'youtubeUrl', 'createdAt'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        if (!value || value !== SortDirection.asc) return SortDirection.desc
        return SortDirection.asc
    }),
]

blogsRouter.get('/', queryValidation, async (req: Request<{}, {}, {}, ReqQuery>, res: Response) => {
    const {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await blogsQueryRepo.findBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection))
})
blogsRouter.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.get('/:id/posts', checkIdValidForMongodb, async (req: Request, res: Response) => {
    let {pageNumber, pageSize, sortBy, sortDirection} = req.query
    const pageNumberM = Number(pageNumber) || 1
    const pageSizeM = Number(pageSize) || 10
    sortBy = String(sortBy)
    const sortByM = (!sortBy || !['id', 'name', 'youtubeUrl', 'createdAt'].includes(sortBy)) ? 'createdAt' : sortBy
    sortDirection = String(sortDirection)
    const sortDirectionM: SortDirection = (!sortDirection || sortDirection !== SortDirection.asc) ? SortDirection.desc : SortDirection.asc

    const foundBlog = await postsQueryRepo.findPostsByBlogId(req.params.id, pageNumberM, pageSizeM, sortByM, sortDirectionM);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.post('/:id/posts', checkAuthorizationMiddleware, listOfValidationPost, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        res.status(201).json(createdPost)
    }
})
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidationBlog, async (req: Request, res: Response) => {
    const createdBlogId = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
    res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', checkAuthorizationMiddleware, listOfValidationBlog, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isUpdatedBlog = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    if (!isUpdatedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
blogsRouter.delete('/:id', checkAuthorizationMiddleware, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})