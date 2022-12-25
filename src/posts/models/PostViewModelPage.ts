import {PostViewModelType} from "./PostViewModel";

export type TypePostViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModelType[]
}