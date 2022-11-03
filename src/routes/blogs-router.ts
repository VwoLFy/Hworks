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

type ReqQuery = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
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
        const fields = ['asc', 'desc'];
        if (!value || !fields.includes(value)) return 'desc'
        return value
    }),
]

// 1) Правильно ли типизировать Request проводя полную проверку queryValidation в Middleware?
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
// 2) Или лучше делать проверку и приведение типов в коде?
// Для строк из Request тоже пришлось делать преобразование в строки это ок?
// Использование as string насколько правильно?
// Обращение к чужому postsQueryRepo это норм?
blogsRouter.get('/:id/posts', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const checkQuery = (query: any): Omit<ReqQuery, "searchNameTerm"> => {
        const pageNumber = Number(query.pageNumber) || 1
        const pageSize = Number(query.pageSize) || 10
        let sortBy = query.sortBy?.toString()
        sortBy = (!sortBy || !['id', 'name', 'youtubeUrl', 'createdAt'].includes(sortBy)) ? 'createdAt' : sortBy
        let sortDirection = query.sortDirection?.toString()
        sortDirection = (!sortDirection || !['asc', 'desc'].includes(sortDirection)) ? 'desc' : sortDirection
        return {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        }
    }
    const validQuery = checkQuery(req.query)
    const foundBlog = await postsQueryRepo.findPostsByBlogId(req.params.id, validQuery.pageNumber, validQuery.pageSize, validQuery.sortBy, validQuery.sortDirection);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
// 3) Использование Middleware из другого роутера это норм?
// Обращение к чужому postsQueryRepo и postsService это норм?
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