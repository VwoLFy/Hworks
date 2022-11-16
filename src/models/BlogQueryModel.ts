import {SortDirection} from "../enums";

export type TypeBlogQueryModel = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}