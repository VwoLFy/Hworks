import {SortDirection} from "../enums";

export type TypeUserQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
    searchLoginTerm: string
    searchEmailTerm: string
}