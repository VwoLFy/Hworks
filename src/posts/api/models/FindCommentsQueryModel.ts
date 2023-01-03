import {SortDirection} from "../../../main/types/enums";

export type FindCommentsQueryModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}