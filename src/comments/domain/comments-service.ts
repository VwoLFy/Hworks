import {UsersRepository} from "../../users/repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {
    CommentClass,
    CreateCommentDtoType, LikeClass,
    LikeCommentDtoType,
    LikesInfoClass,
    UpdateCommentDtoType
} from "../types/types";
import {PostModel} from "../../posts/types/mongoose-schemas-models";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createComment({postId, content, userId}: CreateCommentDtoType): Promise<string | null> {
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
        return this.commentsRepository.createComment(newComment)
    }
    async updateComment({commentId, content, userId}: UpdateCommentDtoType): Promise<number | null> {
        const userIdFromDB = await this.commentsRepository.findUserIdByCommentId(commentId)
        if (!userIdFromDB) {
            return 404
        } else if (userIdFromDB !== userId) {
            return 403
        }
        return await this.commentsRepository.updateComment(commentId, content)
    }
    async likeComment({commentId, userId, likeStatus}: LikeCommentDtoType): Promise<boolean> {
        const isCommentExist = await this.commentsRepository.isCommentExist(commentId)
        if (!isCommentExist) return false
        await this.setLikeStatus({commentId, userId, likeStatus})
        await this.commentsRepository.updateLikesCount(commentId)
        return true
    }
    async setLikeStatus({commentId, userId, likeStatus}: LikeCommentDtoType) {
        const isLikeUpdated = await this.commentsRepository.updateLikeStatus({commentId, userId, likeStatus})
        if (isLikeUpdated) return

        const like = new LikeClass(commentId, userId, likeStatus)
        await this.commentsRepository.newLikeStatus(like)
    }
    async deleteComment(commentId: string, userId: string): Promise<number | null> {
        const userIdFromDB = await this.commentsRepository.findUserIdByCommentId(commentId)
        if (!userIdFromDB) {
            return 404
        } else if (userIdFromDB !== userId) {
            return 403
        }
        return await this.commentsRepository.deleteComment(commentId)
    }
    async deleteAll() {
        await this.commentsRepository.deleteAll()
    }
}