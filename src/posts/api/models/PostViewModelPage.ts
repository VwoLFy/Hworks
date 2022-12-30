import {PostViewModel} from "./PostViewModel";

export type PostViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}