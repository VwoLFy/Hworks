import {SortDirection} from "../../../main/types/enums";

export type FindUsersQueryModel = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchLoginTerm: string,
    searchEmailTerm: string
}