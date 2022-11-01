import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body, query} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";

export const blogsRouter = Router({});

interface ReqQuery {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
    .isString().trim().isLength({min: 1, max: 15});
const youtubeUrlValidation = body('youtubeUrl', "'youtubeUrl' must be a string in range from 1 to 100 symbols")
    .isString().trim().matches("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$").isLength({
        min: 1,
        max: 100
    });
const listOfValidation = [nameValidation, youtubeUrlValidation, inputValidationMiddleware];
const queryValidation = [
    query('searchNameTerm').customSanitizer(value => {
        if (!value) return null;
        return value
    }).toLowerCase(),
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
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidation, async (req: Request, res: Response) => {
    const createdBlogId = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
    res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', checkAuthorizationMiddleware, listOfValidation, checkIdValidForMongodb, async (req: Request, res: Response) => {
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