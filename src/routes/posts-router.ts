import {Request, Response, Router} from "express";
import {body, CustomValidator, query} from "express-validator";
import {checkAuthorizationMiddleware} from "../middlewares/check-authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {checkIdValidForMongodb} from "../middlewares/check-id-valid-for-mongodb";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";

export const postsRouter = Router({});

interface ReqQuery {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

const titleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols")
    .isString().trim().isLength({min: 1, max: 30});
const shortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols")
    .isString().trim().isLength({min: 1, max: 100});
const contentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols")
    .isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = async value => {
    const foundBlog = await blogsQueryRepo.findBlogById(value)
    if (!foundBlog) throw new Error();
    return true;
};
const blogIdValidation = body('blogId', "'blogId' must be exist").isMongoId().custom(blogIdIsExist);
export const listOfValidationPost = [titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware];
const queryValidation = [
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
        const fields = ['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        const fields = ['asc', 'desc'];
        if (!value || !fields.includes(value)) return 'desc'
        return value
    }),
]

postsRouter.get("/", queryValidation, async (req: Request<{}, {}, {}, ReqQuery>, res: Response) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await postsQueryRepo.findPosts(pageNumber, pageSize, sortBy, sortDirection))
})
postsRouter.get("/:id", checkIdValidForMongodb, async (req: Request, res: Response) => {
    const foundPost = await postsQueryRepo.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundPost)
    }
})
postsRouter.post("/", checkAuthorizationMiddleware, blogIdValidation, listOfValidationPost, async (req: Request, res: Response) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        res.status(201).json(createdPost)
    }
})
postsRouter.put("/:id", checkAuthorizationMiddleware, blogIdValidation, listOfValidationPost, checkIdValidForMongodb, async (req: Request, res: Response) => {
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
