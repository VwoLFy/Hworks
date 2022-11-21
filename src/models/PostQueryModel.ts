import {SortDirection} from "../types/enums";

export type TypePostQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}