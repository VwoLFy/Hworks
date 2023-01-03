import {Comment, CommentModel} from "../domain/comment.schema";
import {injectable} from "inversify";
import {LikeModel} from "../domain/like.schema";
import {FindCommentsByPostIdDto} from "./dto/FindCommentsByPostIdDto";
import {CommentViewModel} from "../api/models/CommentViewModel";
import {CommentViewModelPage} from "../api/models/CommentViewModelPage";


@injectable()
export class CommentsQueryRepo {
    async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
        let foundComment: Comment | null = await CommentModel.findById({_id: commentId}).lean()
        if (!foundComment) return null
        if (userId) foundComment = await this.commentWithUserLikeStatus(foundComment, userId)
        return this.commentWithReplaceId(foundComment)
    }
    async findCommentsByPostId({postId, page, pageSize, sortBy, sortDirection, userId}: FindCommentsByPostIdDto): Promise<CommentViewModelPage | null> {
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const sortOptions = {[sortBy]: sortDirection}
        const totalCount = await CommentModel.countDocuments({postId})
        if (!totalCount) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const commentsWith_id = (await CommentModel
            .find({postId})
            .skip( (page - 1) * pageSize)
            .limit(pageSize)
            .sort(sortOptions)
            .lean())

        let items: CommentViewModel[] = []
        for (let commentWith_id of commentsWith_id) {
            if (userId) commentWith_id = await this.commentWithUserLikeStatus(commentWith_id, userId)

            const item = this.commentWithReplaceId(commentWith_id)
            items = [...items, item]
        }

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    }
    commentWithReplaceId(comment: Comment): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: comment.likesInfo
        }
    }

    async commentWithUserLikeStatus(comment: Comment, userId: string): Promise<Comment> {
        const status = await LikeModel.findOne({commentId: comment._id, userId}).lean()
        if (status) comment.likesInfo.myStatus = status.likeStatus
        return comment
    }
}