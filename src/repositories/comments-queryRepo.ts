import {LikeStatus, SortDirection} from "../types/enums";
import {CommentClass} from "../types/types";
import {CommentModel, LikeModel} from "../types/mongoose-schemas-models";

type LikesInfoOutputModelType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}
type CommentOutputModelType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: LikesInfoOutputModelType
}
type CommentOutputPageType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:  CommentOutputModelType[]
}

export class CommentsQueryRepo {
    async findCommentById(commentId: string, userId: string | null): Promise<CommentOutputModelType | null> {
        const foundComment: CommentClass | null = await CommentModel.findById({_id: commentId}).select('-likesInfo._id').lean()
        if (!foundComment) return null
        const foundLikes = await this.foundLikes(commentId, userId)
        foundComment.likesInfo.likesCount = foundLikes.likesCount
        foundComment.likesInfo.dislikesCount = foundLikes.dislikesCount
        foundComment.likesInfo.myStatus = foundLikes.myStatus
        return this.commentWithReplaceId(foundComment)
    }
    async findCommentsByPostId(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection, userId: string | null): Promise<CommentOutputPageType | null> {
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const sortOptions = {[sortBy]: sortDirection}
        const totalCount = await CommentModel.countDocuments({postId})
        if (!totalCount) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const items_id = (await CommentModel
            .find({postId})
            .select('-likesInfo._id')
            .skip( (page - 1) * pageSize)
            .limit(pageSize)
            .sort(sortOptions)
            .lean())

        let items: CommentOutputModelType[] = []
        for (const item_id of items_id) {
            const foundLikes = await this.foundLikes(item_id._id.toString(), userId)
            item_id.likesInfo.likesCount = foundLikes.likesCount
            item_id.likesInfo.dislikesCount = foundLikes.dislikesCount
            item_id.likesInfo.myStatus = foundLikes.myStatus

            const item = this.commentWithReplaceId(item_id)
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
    commentWithReplaceId(comment: CommentClass): CommentOutputModelType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: comment.likesInfo
        }
    }

    async foundLikes(commentId: string, userId: string | null): Promise<LikesInfoOutputModelType> {
        let myStatus = LikeStatus.None
        if (userId) {
            const status = await LikeModel.findOne({commentId, userId}).lean()
            if (status) myStatus = status.likeStatus
        }
        const likesCount = await LikeModel.countDocuments({commentId, likeStatus: 'Like'})
        const dislikesCount = await LikeModel.countDocuments({commentId, likeStatus: 'Dislike'})
        return {
            likesCount,
            dislikesCount,
            myStatus
        }
    }
}