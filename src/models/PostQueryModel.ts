import {SortDirection} from "../types/enums";

export type PostQueryModelType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}