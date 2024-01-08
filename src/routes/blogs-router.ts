import { Request, Response, Router } from 'express';
import { blogsRepository } from '../repositories/blogs-repository';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware';
import { checkAuthorizationMiddleware } from '../middlewares/check-authorization-middleware';
import { HTTP_Status } from '../enums';

export const blogsRouter = Router({});

const nameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 });
const descriptionValidation = body('description', "'description' must be a string in range from 1 to 500 symbols")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 });
const websiteUrlValidation = body('websiteUrl', "'websiteUrl' must be a string in range from 1 to 100 symbols")
  .isString()
  .trim()
  .matches('https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  .isLength({ min: 1, max: 100 });
const listOfValidation = [nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware];

blogsRouter.get('/', (req: Request, res: Response) => {
  res.json(blogsRepository.findBlogs());
});
blogsRouter.get('/:id', (req: Request, res: Response) => {
  const foundBlog = blogsRepository.findBlog(req.params.id);
  if (foundBlog) {
    res.json(foundBlog);
  } else {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  }
});
blogsRouter.post('/', checkAuthorizationMiddleware, listOfValidation, (req: Request, res: Response) => {
  const createdBlog = blogsRepository.createBlog(req.body);
  res.status(HTTP_Status.CREATED_201).json(createdBlog);
});
blogsRouter.put('/:id', checkAuthorizationMiddleware, listOfValidation, (req: Request, res: Response) => {
  const isUpdatedBlog = blogsRepository.updateBlog(req.params.id, req.body);
  if (!isUpdatedBlog) res.sendStatus(HTTP_Status.NOT_FOUND_404);
  res.sendStatus(HTTP_Status.NO_CONTENT_204);
});
blogsRouter.delete('/:id', checkAuthorizationMiddleware, (req: Request, res: Response) => {
  const isDeletedBlog = blogsRepository.deleteBlog(req.params.id);
  if (!isDeletedBlog) {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  } else {
    res.sendStatus(HTTP_Status.NO_CONTENT_204);
  }
});
