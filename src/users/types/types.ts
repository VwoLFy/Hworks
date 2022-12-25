import {ObjectId} from "mongodb";
import {SortDirection} from "../../main/types/enums";

export class UserAccountClass {
    createdAt: string

    constructor(public login: string,
                public passwordHash: string,
                public email: string) {
        this.createdAt = new Date().toISOString()
    }
}
export class EmailConfirmationClass {
    constructor(public isConfirmed: boolean,
                public confirmationCode: string,
                public expirationDate: Date) {
    }
}
export class UserClass {
    _id: ObjectId

    constructor(public accountData: UserAccountClass,
                public emailConfirmation: EmailConfirmationClass) {
        this._id = new ObjectId()
    }
}

export type CreateUserDtoType = {
    login: string
    password: string
    email: string
}
export type FindUsersDtoType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchLoginTerm: string,
    searchEmailTerm: string
}