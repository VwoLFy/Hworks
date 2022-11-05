import {SortDirection} from "../routes/blogs-router";

export type TypeBlogQueryModel = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}