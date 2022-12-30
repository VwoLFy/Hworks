import {Router} from "express";
import {
    deleteCommentByIdValidation,
    getCommentByIdValidation, likeCommentValidation,
    updateCommentByIdValidation
} from "../../main/middlewares/comment-validators";
import {container} from "../../main/composition-root";
import {CommentsController} from "./comments-controller";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', getCommentByIdValidation, commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id', updateCommentByIdValidation, commentsController.updateComment.bind(commentsController))
commentsRouter.put('/:id/like-status', likeCommentValidation, commentsController.likeComment.bind(commentsController))
commentsRouter.delete('/:id', deleteCommentByIdValidation, commentsController.deleteComment.bind(commentsController))