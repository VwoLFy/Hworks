import {CommentViewModel} from "./CommentViewModel";

export type CommentViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:  CommentViewModel[]
}