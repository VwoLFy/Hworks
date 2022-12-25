import {SortDirection} from "../../main/types/enums";

export type UserQueryModelType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
    searchLoginTerm: string
    searchEmailTerm: string
}