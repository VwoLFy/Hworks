import {TypeCommentViewModel} from "./CommentViewModel";

export type TypeCommentViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:  TypeCommentViewModel[]
}