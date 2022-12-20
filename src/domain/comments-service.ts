import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentClass} from "../types/types";
import {PostModel} from "../types/mongoose-schemas-models";

export class CommentsService {
    constructor(protected usersRepository: UsersRepository,
                protected commentsRepository: CommentsRepository) {}

    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
        const isPostExist = await PostModel.isPostExist(postId)
        const userLogin = await this.usersRepository.findUserLoginById(userId)
        if (!isPostExist || !userLogin) return null
        const newComment = new CommentClass(
            content,
            userId,
            userLogin,
            postId
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