import {Response, Router} from "express";
import {RequestWithParam, RequestWithParamAndBody} from "../types/types";
import {TypeCommentViewModel} from "../models/CommentViewModel";
import {commentsQueryRepo} from "../repositories/comments-queryRepo";
import {TypeCommentInputModel} from "../models/CommentInputModel";
import {
    deleteCommentByIdValidation,
    getCommentByIdValidation,
    updateCommentByIdValidation
} from "../middlewares/validators";
import {commentsService} from "../domain/comments-service";

export const commentsRouter = Router({})

commentsRouter.get(('/:id'), getCommentByIdValidation, async (req: RequestWithParam, res: Response<TypeCommentViewModel>) => {
    const foundComment = await commentsQueryRepo.findCommentById(req.params.id);
    if (!foundComment) {
        res.sendStatus(404)
    } else {
        res.status(200).json(foundComment)
    }
})
commentsRouter.put(('/:id'), updateCommentByIdValidation, async (req: RequestWithParamAndBody<TypeCommentInputModel>, res: Response) => {
    const updateStatus = await commentsService.updateComment(req.params.id, req.body.content, req.userId)
    if (!updateStatus) {
        res.sendStatus(404)
    } else {
        res.sendStatus(updateStatus)
    }
})
commentsRouter.delete(('/:id'), deleteCommentByIdValidation, async (req: RequestWithParam, res: Response) => {
    const deleteStatus = await commentsService.deleteComment(req.params.id, req.userId)
    if (!deleteStatus) {
        res.sendStatus(404)
    } else {
        res.sendStatus(deleteStatus)
    }
})