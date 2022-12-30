import {SortDirection} from "../../../main/types/enums";

export type UserQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
    searchLoginTerm: string
    searchEmailTerm: string
}