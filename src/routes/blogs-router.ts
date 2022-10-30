import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";

export const blogsRouter = Router({});

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols").isString().trim().isLength({min: 1, max: 15});
const youtubeUrlValidation = body('youtubeUrl', "'youtubeUrl' must be a string in range from 1 to 100 symbols").isString().trim().matches("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$"
).isLength({min: 1, max: 100});
const listOfValidation = [nameValidation, youtubeUrlValidation, inputValidationMiddleware];

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.json(await blogsService.findBlogs())
})
blogsRouter.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const foundBlog = await blogsService.findBlog(req.params.id);
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundBlog)
    }
})
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidation, async (req: Request, res: Response) => {
    const createdBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
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