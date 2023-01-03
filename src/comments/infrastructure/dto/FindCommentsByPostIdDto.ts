import {SortDirection} from "../../../main/types/enums";

export type FindCommentsByPostIdDto = {
    postId: string
    page: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    userId: string | null
}