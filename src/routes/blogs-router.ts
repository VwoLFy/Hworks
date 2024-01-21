import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";
import { HTTP_Status } from '../enums';

export const blogsRouter = Router({});

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
    .isString().trim().isLength({min: 1, max: 15});
const youtubeUrlValidation = body('youtubeUrl', "'youtubeUrl' must be a string in range from 1 to 100 symbols")
    .isString().trim().matches("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$").isLength({min: 1, max: 100});
const descriptionValidation = body('description', "'description' must be a string in range from 1 to 500 symbols")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 });
const listOfValidation = [nameValidation, youtubeUrlValidation, descriptionValidation, inputValidationMiddleware];

blogsRouter.get('/', async (req: Request, res: Response) => {
    res.json(await blogsQueryRepo.findBlogs())
})
blogsRouter.get('/:id', checkIdValidForMongodb, async (req: Request, res: Response) => {
    const foundBlog = await blogsQueryRepo.findBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(HTTP_Status.NOT_FOUND_404);
    } else {
      res.json(foundBlog);
    }
})
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidation, async (req: Request, res: Response) => {
    const createdBlogId = await blogsService.createBlog(req.body);
    const createdBlog = await blogsQueryRepo.findBlogById(createdBlogId);
  res.status(HTTP_Status.CREATED_201).json(createdBlog);
})
blogsRouter.put('/:id', checkAuthorizationMiddleware, listOfValidation, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isUpdatedBlog = await blogsService.updateBlog(req.params.id, req.body);
    if (!isUpdatedBlog) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})
blogsRouter.delete('/:id', checkAuthorizationMiddleware, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!isDeletedBlog) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})