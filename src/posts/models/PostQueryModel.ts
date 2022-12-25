import {SortDirection} from "../../main/types/enums";

export type PostQueryModelType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}