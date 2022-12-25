import {LikeStatus, SortDirection} from "../../main/types/enums";
import {CommentClass} from "../../main/types/types";
import {CommentModel, LikeModel} from "../../main/types/mongoose-schemas-models";

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
        let foundComment: CommentClass | null = await CommentModel.findById({_id: commentId}).lean()
        if (!foundComment) return null
        if (userId) foundComment = await this.commentWithUserLikeStatus(foundComment, userId)
        return this.commentWithReplaceId(foundComment)
    }
    async findCommentsByPostId(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection, userId: string | null): Promise<CommentOutputPageType | null> {
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

        let items: CommentOutputModelType[] = []
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

    async commentWithUserLikeStatus(comment: CommentClass, userId: string): Promise<CommentClass> {
        const status = await LikeModel.findOne({commentId: comment._id, userId}).lean()
        if (status) return {...comment, likesInfo: {...comment.likesInfo, myStatus: status.likeStatus}}
        return comment
    }
}