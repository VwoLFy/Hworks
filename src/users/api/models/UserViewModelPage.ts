import {UserViewModel} from "./UserViewModel";

export type UserViewModelPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserViewModel[]
}