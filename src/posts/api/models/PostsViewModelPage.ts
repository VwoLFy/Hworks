import {PostViewModel} from "./PostViewModel";

export type PostsViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewModel[]
}