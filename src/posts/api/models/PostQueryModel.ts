import {SortDirection} from "../../../main/types/enums";

export type PostQueryModel = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: SortDirection
}