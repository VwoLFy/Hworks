import {SortDirection} from "../../main/types/enums";

export type UpdateBlogDTO = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogDTO = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsDTO = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}