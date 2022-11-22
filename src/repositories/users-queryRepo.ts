import {userCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeEmailConfirmation, TypeUserAccountType} from "../domain/auth-service";

type TypeUserOutputModel = {
    id: string
    login: string
    email: string
    createdAt: string
}
type TypeUserOutputPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TypeUserOutputModel[]
}
type TypeUserFromDB = {
    _id: ObjectId
    accountData: TypeUserAccountType
    emailConfirmation: TypeEmailConfirmation
}

enum SortDirection {
    asc = 1,
    desc = -1
}

export const usersQueryRepo = {
    async findUsers(pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection, searchLoginTerm: string, searchEmailTerm: string): Promise<TypeUserOutputPage> {
        let filterFind = {}

        if (searchLoginTerm && searchEmailTerm) {
            filterFind = {
                $or: [
                    {'accountData.login': {$regex: searchLoginTerm, $options: 'i'}},
                    {'accountData.email': {$regex: searchEmailTerm, $options: 'i'}}
                ]
            }
        } else if (searchLoginTerm) {
            filterFind = {'accountData.login': {$regex: searchLoginTerm, $options: 'i'}}
        } else if (searchEmailTerm) {
            filterFind = {'accountData.email': {$regex: searchEmailTerm, $options: 'i'}}
        }

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort = {[sortBy]: sortDirection}

        const totalCount = await userCollection.count(filterFind)
        const pagesCount = Math.ceil( totalCount / pageSize)
        const page = pageNumber;

        const items = (await userCollection.find(filterFind)
            .skip((pageNumber - 1) * pageSize )
            .limit(pageSize)
            .sort(optionsSort)
            .toArray())
            .map(foundBlog => this.userWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findUserById(id: string): Promise<TypeUserOutputModel | null> {
        const foundUser = await userCollection.findOne({_id: new ObjectId(id)})
        if (!foundUser) {
            return null
        } else {
            return this.userWithReplaceId(foundUser)
        }
    },
    userWithReplaceId(object: TypeUserFromDB): TypeUserOutputModel {
        return {
            id: object._id.toString(),
            login: object.accountData.login,
            email: object.accountData.email,
            createdAt: object.accountData.createdAt
        }
    }
}
