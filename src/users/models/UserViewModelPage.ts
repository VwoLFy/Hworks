import {UserViewModelType} from "./UserViewModel";

export type UserViewModelPageType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserViewModelType[]
}