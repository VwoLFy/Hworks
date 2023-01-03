import {UsersRepository} from "../../users/infrastructure/users-repository";
import {CommentsRepository} from "../infrastructure/comments-repository";
import {
    CreateCommentDTO,
    LikeCommentDTO,
    UpdateCommentDTO
} from "./dto";
import {PostModel} from "../../posts/domain/post.schema";
import {inject, injectable} from "inversify";
import {CommentClass, CommentModel, LikesInfoClass} from "../domain/comment.schema";
import {LikeStatus} from "../../main/types/enums";
import {LikeClass, LikeDocument, LikeModel} from "../domain/like.schema";

@injectable()
export class CommentsService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createComment({postId, content, userId}: CreateCommentDTO): Promise<string | null> {
        const isPostExist = await PostModel.isPostExist(postId)
        const userLogin = await this.usersRepository.findUserLoginById(userId)
        if (!isPostExist || !userLogin) return null
        const likesInfo = new LikesInfoClass()
        const newComment = new CommentClass(
            content,
            userId,
            userLogin,
            postId,
            likesInfo
        )
        const comment = new CommentModel(newComment)
        await this.commentsRepository.saveComment(comment)
        return comment.id
    }
    async updateComment({commentId, content, userId}: UpdateCommentDTO): Promise<number | null> {
        const foundComment = await this.commentsRepository.findComment(commentId)
        if (!foundComment) {
            return 404
        } else if (foundComment.userId !== userId) {
            return 403
        }
        foundComment.updateComment(content)
        await this.commentsRepository.saveComment(foundComment)
        return 204
    }
    async likeComment({commentId, userId, likeStatus}: LikeCommentDTO): Promise<boolean> {
        const foundComment = await this.commentsRepository.findComment(commentId)
        if (!foundComment) return false

        let oldLikeStatus: LikeStatus
        let like: LikeDocument
        const foundLike = await this.commentsRepository.findLikeStatus(commentId, userId)

        if (foundLike) {
            oldLikeStatus = foundLike.likeStatus
            like = foundLike
            like.updateLikeStatus(likeStatus)
        } else {
            oldLikeStatus = LikeStatus.None
            const newLike = new LikeClass(commentId, userId, likeStatus)
            like = new LikeModel(newLike)
        }

        foundComment.updateLikesCount(likeStatus, oldLikeStatus)
        await this.commentsRepository.saveComment(foundComment)

        if (likeStatus === LikeStatus.None) {
            await this.commentsRepository.deleteLike(like._id)
        } else {
            await this.commentsRepository.saveLike(like)
        }
        return true
    }
    async deleteComment(commentId: string, userId: string): Promise<number | null> {
        const foundComment = await this.commentsRepository.findComment(commentId)
        if (!foundComment) {
            return 404
        } else if (foundComment.userId !== userId) {
            return 403
        }
        return await this.commentsRepository.deleteComment(foundComment._id)
    }
    async deleteAll() {
        await this.commentsRepository.deleteAll()
    }
}