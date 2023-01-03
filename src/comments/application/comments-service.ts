import {UsersRepository} from "../../users/infrastructure/users-repository";
import {CommentsRepository} from "../infrastructure/comments-repository";
import {
    UpdateCommentDto
} from "./dto/UpdateCommentDto";
import {PostModel} from "../../posts/domain/post.schema";
import {inject, injectable} from "inversify";
import {Comment, CommentModel, LikesInfo} from "../domain/comment.schema";
import {LikeStatus} from "../../main/types/enums";
import {Like, LikeDocument, LikeModel} from "../domain/like.schema";
import {CreateCommentDto} from "./dto/CreateCommentDto";
import {LikeCommentDto} from "./dto/LikeCommentDto";

@injectable()
export class CommentsService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createComment({postId, content, userId}: CreateCommentDto): Promise<string | null> {
        const isPostExist = await PostModel.isPostExist(postId)
        const userLogin = await this.usersRepository.findUserLoginById(userId)
        if (!isPostExist || !userLogin) return null
        const likesInfo = new LikesInfo()
        const newComment = new Comment(
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
    async updateComment({commentId, content, userId}: UpdateCommentDto): Promise<number | null> {
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
    async likeComment({commentId, userId, likeStatus}: LikeCommentDto): Promise<boolean> {
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
            const newLike = new Like(commentId, userId, likeStatus)
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