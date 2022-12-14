import {BlogViewModelType} from "./BlogViewModel";

export type TypeBlogViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogViewModelType[]
}