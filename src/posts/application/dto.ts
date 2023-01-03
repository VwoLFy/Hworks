import {SortDirection} from "../../main/types/enums";

export type UpdatePostDTO = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type CreatePostDTO = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type FindPostsDTO = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}
export type FindPostsByBlogIdDTO = {
    blogId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}