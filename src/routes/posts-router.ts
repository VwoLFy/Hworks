import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service";
import {postsQueryRepo} from "../repositories/posts-queryRepo";
import {
    createPostValidation, deletePostValidation,
    getPostsValidation,
    getPostValidation,
    updatePostValidation
} from "../middlewares/validators";
export const postsRouter = Router({});

interface ReqQuery {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

postsRouter.get("/", getPostsValidation, async (req: Request<{}, {}, {}, ReqQuery>, res: Response) => {
    const {pageNumber, pageSize, sortBy, sortDirection} = req.query;
    res.json(await postsQueryRepo.findPosts(pageNumber, pageSize, sortBy, sortDirection))
})
postsRouter.get("/:id", getPostValidation, async (req: Request, res: Response) => {
    const foundPost = await postsQueryRepo.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundPost)
    }
})
postsRouter.post("/", createPostValidation, async (req: Request, res: Response) => {
    const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!createdPostId) {
        res.sendStatus(404)
    } else {
        const createdPost = await postsQueryRepo.findPostById(createdPostId)
        res.status(201).json(createdPost)
    }
})
postsRouter.put("/:id", updatePostValidation, async (req: Request, res: Response) => {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    if (!isUpdatedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
postsRouter.delete("/:id", deletePostValidation, async (req: Request, res: Response) => {
    const isDeletedPost = await postsService.deletePost(req.params.id)
    if (!isDeletedPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})