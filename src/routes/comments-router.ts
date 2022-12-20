import {Router} from "express";
import {
    deleteCommentByIdValidation,
    getCommentByIdValidation,
    updateCommentByIdValidation
} from "../middlewares/comment-validators";
import {commentsController} from "../composition-root";

export const commentsRouter = Router({})

commentsRouter.get('/:id', getCommentByIdValidation, commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id', updateCommentByIdValidation, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', deleteCommentByIdValidation, commentsController.deleteComment.bind(commentsController))