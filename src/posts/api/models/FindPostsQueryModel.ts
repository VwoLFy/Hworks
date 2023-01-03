import {SortDirection} from "../../../main/types/enums";

export type FindPostsQueryModel = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}