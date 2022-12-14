import {SortDirection} from "../types/enums";

export type BlogQueryModelType = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}