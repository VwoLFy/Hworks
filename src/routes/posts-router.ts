import {Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {
    createPostValidation, deletePostValidation,
    getPostsValidation,
    getPostValidation,
    updatePostValidation
} from "../middlewares/validators";
import {RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithQuery} from "../types";
import {TypePostQueryModel} from "../models/PostQueryModel";
import {TypePostInputModel} from "../models/PostInputModel";
import {TypePostUpdateModel} from "../models/PostUpdateModel";
export const postsRouter = Router({});

postsRouter.get("/", getPostsValidation, async (req: RequestWithQuery<TypePostQueryModel>, res: Response) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await postsQueryRepo.findPosts(+pageNumber, +pageSize, sortBy, sortDirection))
})
postsRouter.get("/:id", getPostValidation, async (req: RequestWithParam<{id: string}>, res: Response) => {
    const foundPost = await postsQueryRepo.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundPost)
    }
})
postsRouter.post("/", createPostValidation, async (req: RequestWithBody<TypePostInputModel>, res: Response) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        res.status(201).json(createdPost)
    }
})
postsRouter.put("/:id", updatePostValidation, async (req: RequestWithParamAndBody<{id: string}, TypePostUpdateModel>, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!isUpdatedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
postsRouter.delete("/:id", deletePostValidation, async (req: RequestWithParam<{id: string}>, res: Response) => {
    const isDeletedPost = await postsService.deletePost(req.params.id)
    if (!isDeletedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})