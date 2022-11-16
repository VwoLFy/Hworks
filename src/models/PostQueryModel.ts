import {SortDirection} from "../enums";

export type TypePostQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}