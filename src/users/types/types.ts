import {ObjectId} from "mongodb";
import {SortDirection} from "../../main/types/enums";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export class UserAccountClass {
    createdAt: string

    constructor(public login: string,
                public passwordHash: string,
                public email: string) {
        this.createdAt = new Date().toISOString()
    }
}

export class EmailConfirmationClass {
    confirmationCode: string
    expirationDate: Date

    constructor(public isConfirmed: boolean) {
        this.confirmationCode = uuidv4()
        this.expirationDate = add(new Date(), {hours: 1})
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