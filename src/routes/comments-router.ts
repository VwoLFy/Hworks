import {Response, Router} from "express";
import {RequestWithParam, RequestWithParamAndBody} from "../types/types";
import {CommentViewModelType} from "../models/CommentViewModel";
import {CommentsQueryRepo} from "../repositories/comments-queryRepo";
import {CommentInputModelType} from "../models/CommentInputModel";
import {CommentsService} from "../domain/comments-service";
import {HTTP_Status} from "../types/enums";
import {
    deleteCommentByIdValidation,
    getCommentByIdValidation,
    updateCommentByIdValidation
} from "../middlewares/comment-validators";

export const commentsRouter = Router({})

class CommentsController {
    private commentsQueryRepo: CommentsQueryRepo;
    private commentsService: CommentsService;

    constructor() {
        this.commentsQueryRepo = new CommentsQueryRepo()
        this.commentsService = new CommentsService()
    }

    async getComment(req: RequestWithParam, res: Response<CommentViewModelType>) {
        const foundComment = await this.commentsQueryRepo.findCommentById(req.params.id);
        if (!foundComment) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.status(HTTP_Status.OK_200).json(foundComment)
        }
    }
    async updateComment(req: RequestWithParamAndBody<CommentInputModelType>, res: Response) {
        const updateStatus = await this.commentsService.updateComment(req.params.id, req.body.content, req.userId)
        if (!updateStatus) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(updateStatus as HTTP_Status)
        }
    }
    async deleteComment(req: RequestWithParam, res: Response) {
        const deleteStatus = await this.commentsService.deleteComment(req.params.id, req.userId)
        if (!deleteStatus) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(deleteStatus as HTTP_Status)
        }
    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:id', getCommentByIdValidation, commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id', updateCommentByIdValidation, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', deleteCommentByIdValidation, commentsController.deleteComment.bind(commentsController))