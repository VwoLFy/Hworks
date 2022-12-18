import {Response, Router} from "express";
import {RequestWithParam, RequestWithParamAndBody} from "../types/types";
import {CommentViewModelType} from "../models/CommentViewModel";
import {commentsQueryRepo} from "../repositories/comments-queryRepo";
import {CommentInputModelType} from "../models/CommentInputModel";
import {commentsService} from "../domain/comments-service";
import {HTTP_Status} from "../types/enums";
import {
    deleteCommentByIdValidation,
    getCommentByIdValidation,
    updateCommentByIdValidation
} from "../middlewares/comment-validators";

export const commentsRouter = Router({})

class CommentsController {
    async getComment(req: RequestWithParam, res: Response<CommentViewModelType>) {
        const foundComment = await commentsQueryRepo.findCommentById(req.params.id);
        if (!foundComment) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundComment)
        }
    }
    async updateComment(req: RequestWithParamAndBody<CommentInputModelType>, res: Response) {
        const updateStatus = await commentsService.updateComment(req.params.id, req.body.content, req.userId)
        if (!updateStatus) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(updateStatus as HTTP_Status)
        }
    }
    async deleteComment(req: RequestWithParam, res: Response) {
        const deleteStatus = await commentsService.deleteComment(req.params.id, req.userId)
        if (!deleteStatus) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(deleteStatus as HTTP_Status)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:id', getCommentByIdValidation, commentsController.getComment)
commentsRouter.put('/:id', updateCommentByIdValidation, commentsController.updateComment)
commentsRouter.delete('/:id', deleteCommentByIdValidation, commentsController.deleteComment)