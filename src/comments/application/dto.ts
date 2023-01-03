import {LikeStatus, SortDirection} from "../../main/types/enums";

export type LikeCommentDTO = {
    commentId: string
    userId: string
    likeStatus: LikeStatus
}
export type CreateCommentDTO = {
    postId: string
    content: string
    userId: string
}
export type UpdateCommentDTO = {
    commentId: string
    content: string
    userId: string
}
export type FindCommentsDTO = {
    postId: string
    page: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    userId: string | null
}