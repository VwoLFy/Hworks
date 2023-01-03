import {BlogViewModel} from "./BlogViewModel";

export type BlogsViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}