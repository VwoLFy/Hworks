import {User, UserModel} from "../domain/user.schema";
import {injectable} from "inversify";
import {UserViewModel} from "../api/models/UserViewModel";
import {UserViewModelPage} from "../api/models/UserViewModelPage";
import {FindUsersQueryModel} from "../api/models/FindUsersQueryModel";


@injectable()
export class UsersQueryRepo{
    async findUsers({pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm}: FindUsersQueryModel): Promise<UserViewModelPage> {
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

        const totalCount = await UserModel.countDocuments(filterFind)
        const pagesCount = Math.ceil( totalCount / pageSize)
        const page = pageNumber;

        const items = (await UserModel.find(filterFind)
            .skip((pageNumber - 1) * pageSize )
            .limit(pageSize)
            .sort(optionsSort)
            .lean())
            .map(foundBlog => this.userWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    }
    async findUserById(id: string): Promise<UserViewModel | null> {
        const foundUser: User | null = await UserModel.findById({_id: id}).lean()
        if (!foundUser) {
            return null
        } else {
            return this.userWithReplaceId(foundUser)
        }
    }
    userWithReplaceId(object: User): UserViewModel {
        return {
            id: object._id.toString(),
            login: object.accountData.login,
            email: object.accountData.email,
            createdAt: object.accountData.createdAt
        }
    }
}