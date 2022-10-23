import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";

export const blogsRouter = Router({});

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols").isString().trim().isLength({min: 1, max: 15});
const youtubeUrlValidation = body('youtubeUrl', "'youtubeUrl' must be a string in range from 1 to 100 symbols").isString().trim().matches("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$"
).isLength({min: 1, max: 100});
const listOfValidation = [nameValidation, youtubeUrlValidation, inputValidationMiddleware];

blogsRouter.get('/', (req: Request, res: Response) => {
    res.json(blogsRepository.findBlogs())
})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlog = blogsRepository.findBlog(req.params.id);
    if (foundBlog) {
        res.json(foundBlog)
    } else {
        res.sendStatus(404)
    }

})
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidation, (req: Request, res: Response) => {
    const createdBlog = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);
    res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', checkAuthorizationMiddleware, listOfValidation, (req: Request, res: Response) => {
    const isUpdatedBlog = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    if (!isUpdatedBlog) res.sendStatus(404);
    res.sendStatus(204)
})
blogsRouter.delete('/:id', checkAuthorizationMiddleware, (req: Request, res: Response) => {
    const isDeletedBlog = blogsRepository.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }

})