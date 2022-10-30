import {Request, Response, Router} from "express";
import {body, CustomValidator} from "express-validator";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const postsRouter = Router({});

const titleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols").isString().trim().isLength({min: 1, max: 30});
const shortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols").isString().trim().isLength({min: 1, max: 100});
const contentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols").isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = async value => {
    const foundBlog = await blogsService.findBlog(value)
    if (!foundBlog) throw new Error();
    return true;

};
const blogIdValidation = body('blogId', "'blogId' must be exist").isMongoId().custom(blogIdIsExist);
const listOfValidation = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware];

postsRouter.get("/", async (req: Request, res: Response) => {
    res.json(await postsService.findPosts())
})
postsRouter.get("/:id", checkIdValidForMongodb, async (req: Request, res: Response) => {
    const foundPost = await postsService.findPost(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundPost)
    }
})
postsRouter.post("/", checkAuthorizationMiddleware, listOfValidation, async (req: Request, res: Response) => {
    const createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!createdPost) {
        res.sendStatus(404)
    } else {
        res.status(201).json(createdPost)
    }
})
postsRouter.put("/:id", checkAuthorizationMiddleware, listOfValidation, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!isUpdatedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
postsRouter.delete("/:id", checkAuthorizationMiddleware, checkIdValidForMongodb, async (req: Request, res: Response) => {
    const isDeletedPost = await postsService.deletePost(req.params.id)
    if (!isDeletedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
