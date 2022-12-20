import {UsersQueryRepo} from "../repositories/users-queryRepo";
import {UsersService} from "../domain/user-service";
import {RequestWithBody, RequestWithParam, RequestWithQuery} from "../types/types";
import {UserQueryModelType} from "../models/UserQueryModel";
import {Response} from "express";
import {UserViewModelPageType} from "../models/UserViewModelPage";
import {UserInputModelType} from "../models/UserInputModel";
import {UserViewModelType} from "../models/UserViewModel";
import {HTTP_Status} from "../types/enums";

export class UsersController {
    constructor(protected usersQueryRepo: UsersQueryRepo,
                protected usersService: UsersService) {
    }

    async getUsers(req: RequestWithQuery<UserQueryModelType>, res: Response<UserViewModelPageType>) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
        res.json(await this.usersQueryRepo.findUsers(+pageNumber, +pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm))
    }

    async createUser(req: RequestWithBody<UserInputModelType>, res: Response<UserViewModelType>) {
        const createdUserId = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (!createdUserId) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        const createdUser = await this.usersQueryRepo.findUserById(createdUserId)
        if (createdUser) res.status(HTTP_Status.CREATED_201).json(createdUser)
    }

    async deleteUser(req: RequestWithParam, res: Response) {
        const isDeletedUser = await this.usersService.deleteUser(req.params.id)
        if (!isDeletedUser) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }
}