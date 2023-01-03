import {SortDirection} from "../../main/types/enums";

export type CreateUserDTO = {
    login: string
    password: string
    email: string
}
export type FindUsersDTO = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchLoginTerm: string,
    searchEmailTerm: string
}