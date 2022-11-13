import {postsRepository} from "../repositories/posts-repository";
import {usersRepository} from "../repositories/users-repository";
import {commentsRepository} from "../repositories/comments-repository";

export type TypeNewComment = {
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}

export const commentsService = {
    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
        const isPostExist = await postsRepository.isPostExist(postId)
        const userLogin = await usersRepository.findUserLoginById(userId)
        if (!isPostExist || !userLogin) return null
        
        const newComment: TypeNewComment = {
            content,
            userId,
            userLogin,
            createdAt: new Date().toISOString(),
            postId
        }
        return commentsRepository.createComment(newComment)
    }
}