import {Response, Router} from "express";
import {RequestWithBody, RequestWithParam, RequestWithQuery} from "../types/types";
import {UserViewModelPageType} from "../models/UserViewModelPage";
import {UserQueryModelType} from "../models/UserQueryModel";
import {UsersQueryRepo} from "../repositories/users-queryRepo";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../middlewares/user-auth-validators";
import {UserInputModelType} from "../models/UserInputModel";
import {UserViewModelType} from "../models/UserViewModel";
import {UsersService} from "../domain/user-service";
import {HTTP_Status} from "../types/enums";

export const usersRouter = Router({})

class UsersController {
    private usersQueryRepo: UsersQueryRepo;
    private usersService: UsersService;

    constructor() {
        this.usersQueryRepo = new UsersQueryRepo()
        this.usersService = new UsersService()
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

const usersController = new UsersController()

usersRouter.get('/', getUsersValidation, usersController.getUsers.bind(usersController))
usersRouter.post('/', createUserValidation, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', deleteUserValidation, usersController.deleteUser.bind(usersController))