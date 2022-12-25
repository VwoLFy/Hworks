import {UsersRepository} from "../../users/repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentClass, LikeClass, LikeCommentDto, LikesInfoClass} from "../../main/types/types";
import {PostModel} from "../../main/types/mongoose-schemas-models";

export class CommentsService {
    constructor(protected usersRepository: UsersRepository,
                protected commentsRepository: CommentsRepository) {}

    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
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
    async updateComment(commentId: string, content: string, userId: string): Promise<number | null> {
        const userIdFromDB = await this.commentsRepository.findUserIdByCommentId(commentId)
        if (!userIdFromDB) {
            return 404
        } else if (userIdFromDB !== userId) {
            return 403
        }
        return await this.commentsRepository.updateComment(commentId, content)
    }
    async likeComment({commentId, userId, likeStatus}: LikeCommentDto): Promise<boolean> {
        const isCommentExist = await this.commentsRepository.isCommentExist(commentId)
        if (!isCommentExist) return false
        await this.setLikeStatus({commentId, userId, likeStatus})
        await this.commentsRepository.updateLikesCount(commentId)
        return true
    }
    async setLikeStatus({commentId, userId, likeStatus}: LikeCommentDto) {
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