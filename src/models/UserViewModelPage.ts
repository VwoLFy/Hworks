import {TypeUserViewModel} from "./UserViewModel";

export type TypeUserViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TypeUserViewModel[]
}