import {SortDirection} from "../../../main/types/enums";

export type FindBlogsQueryModel = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}