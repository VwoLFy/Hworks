import {SortDirection} from "../SortDirection";

export type TypeBlogQueryModel = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}