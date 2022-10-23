import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body, CustomValidator} from "express-validator";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsRouter = Router({});

const titleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols").isString().trim().isLength({min: 1, max: 30});
const shortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols").isString().trim().isLength({min: 1, max: 100});
const contentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols").isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = value => {
    const foundBlog = blogsRepository.findBlog(value)
    if (!foundBlog)  throw new Error();
    return true;

};
const blogIdValidation = body('blogId', "'blogId' must be exist").custom(blogIdIsExist);
const listOfValidation = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware];

postsRouter.get("/", (req:Request, res:Response) => {
    res.json(postsRepository.findPosts())
})
postsRouter.get("/:id", (req:Request, res:Response) => {
    const foundPost = postsRepository.findPost(req.params.id)
    if (!foundPost) return res.sendStatus(404);
    return res.status(200).json(foundPost)
})
postsRouter.post("/", checkAuthorizationMiddleware, listOfValidation, (req:Request, res:Response) => {
    const createdPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(201).json(createdPost)
})
postsRouter.put("/:id", checkAuthorizationMiddleware, listOfValidation, (req:Request, res:Response) => {
    const isUpdatedPost = postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!isUpdatedPost) return res.sendStatus(404);
    return res.sendStatus(204)
})
postsRouter.delete("/:id", checkAuthorizationMiddleware, (req:Request, res:Response) => {
    const isDeletedPost = postsRepository.deletePost(req.params.id)
    if (!isDeletedPost) return res.sendStatus(404);
    return res.sendStatus(204)
})
