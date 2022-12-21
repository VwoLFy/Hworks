import {LikeStatus, SortDirection} from "../types/enums";
import {CommentClass} from "../types/types";
import {CommentModel} from "../types/mongoose-schemas-models";

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
    async findCommentById(id: string): Promise<CommentOutputModelType | null> {
        const foundComment: CommentClass | null = await CommentModel.findById({_id: id}).lean()
        if (!foundComment) return null
        return this.commentWithReplaceId(foundComment)
    }
    async findCommentsByPostId(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<CommentOutputPageType | null> {
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const sortOptions = {[sortBy]: sortDirection}
        const totalCount = await CommentModel.countDocuments({postId})
        if (!totalCount) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const items = (await CommentModel
            .find({postId})
            .skip( (page - 1) * pageSize)
            .limit(pageSize)
            .sort(sortOptions)
            .lean())
            .map(c => this.commentWithReplaceId(c))
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
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        }
    }
}