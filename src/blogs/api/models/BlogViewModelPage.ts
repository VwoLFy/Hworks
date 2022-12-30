import {BlogViewModel} from "./BlogViewModel";

export type BlogViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModel[]
}