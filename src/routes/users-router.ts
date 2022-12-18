import {Response, Router} from "express";
import {RequestWithBody, RequestWithParam, RequestWithQuery} from "../types/types";
import {UserViewModelPageType} from "../models/UserViewModelPage";
import {UserQueryModelType} from "../models/UserQueryModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../middlewares/user-auth-validators";
import {UserInputModelType} from "../models/UserInputModel";
import {UserViewModelType} from "../models/UserViewModel";
import {usersService} from "../domain/user-service";
import {HTTP_Status} from "../types/enums";

export const usersRouter = Router({})

class UsersController {
    async getUsers(req: RequestWithQuery<UserQueryModelType>, res: Response<UserViewModelPageType>) {
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
        res.json(await usersQueryRepo.findUsers(+pageNumber, +pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm))
    }
    async createUser(req: RequestWithBody<UserInputModelType>, res: Response<UserViewModelType>) {
        const createdUserId = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (!createdUserId) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
        const createdUser = await usersQueryRepo.findUserById(createdUserId)
        if (createdUser) res.status(HTTP_Status.CREATED_201).json(createdUser)
    }
    async deleteUser(req: RequestWithParam, res: Response) {
        const isDeletedUser = await usersService.deleteUser(req.params.id)
        if (!isDeletedUser) {
            res.sendStatus(HTTP_Status.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_Status.NO_CONTENT_204)
        }
    }
}

const usersController = new UsersController()

usersRouter.get('/', getUsersValidation, usersController.getUsers)
usersRouter.post('/', createUserValidation, usersController.createUser)
usersRouter.delete('/:id', deleteUserValidation, usersController.deleteUser)