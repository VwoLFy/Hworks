import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";
import {CommentClass} from "../types/types";
import {PostModel} from "../types/mongoose-schemas-models";

class CommentsService {
    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
        const isPostExist = await PostModel.isPostExist(postId)
        const userLogin = await usersRepository.findUserLoginById(userId)
        if (!isPostExist || !userLogin) return null
        const newComment = new CommentClass(
            content,
            userId,
            userLogin,
            postId
        )
        return commentsRepository.createComment(newComment)
    }
    async updateComment(commentId: string, content: string, userId: string): Promise<number | null> {
        const userIdFromDB = await commentsRepository.findUserIdByCommentId(commentId)
        if (!userIdFromDB) {
            return 404
        } else if (userIdFromDB !== userId) {
            return 403
        }
        return await commentsRepository.updateComment(commentId, content)
    }
    async deleteComment(commentId: string, userId: string): Promise<number | null> {
        const userIdFromDB = await commentsRepository.findUserIdByCommentId(commentId)
        if (!userIdFromDB) {
            return 404
        } else if (userIdFromDB !== userId) {
            return 403
        }
        return await commentsRepository.deleteComment(commentId)
    }
    async deleteAll() {
        await commentsRepository.deleteAll()
    }
}

export const commentsService = new CommentsService()