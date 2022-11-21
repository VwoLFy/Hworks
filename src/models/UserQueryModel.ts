import {SortDirection} from "../types/enums";

export type TypeUserQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
    searchLoginTerm: string
    searchEmailTerm: string
}