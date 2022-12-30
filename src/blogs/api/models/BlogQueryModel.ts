import {SortDirection} from "../../../main/types/enums";

export type BlogQueryModel = {
    searchNameTerm: string
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}