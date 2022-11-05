import {SortDirection} from "../routes/blogs-router";

export type TypePostQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}