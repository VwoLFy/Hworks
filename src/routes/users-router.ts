import {Response, Router} from "express";
import {RequestWithBody, RequestWithParam, RequestWithQuery} from "../types";
import {TypeUserViewModelPage} from "../models/UserViewModelPage";
import {TypeUserQueryModel} from "../models/UserQueryModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../middlewares/validators";
import {TypeUserInputModel} from "../models/UserInputModel";
import {TypeUserViewModel} from "../models/UserViewModel";
import {usersService} from "../domain/user-service";

export const usersRouter = Router({})

usersRouter.get('/', getUsersValidation, async (req: RequestWithQuery<TypeUserQueryModel>, res: Response<TypeUserViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
    res.json( await usersQueryRepo.findUsers(+pageNumber, +pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) )
})
usersRouter.post('/', createUserValidation, async (req: RequestWithBody<TypeUserInputModel>, res: Response<TypeUserViewModel>) => {
    const createdUserId = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    const createdUser = await usersQueryRepo.findUserById(createdUserId)
    if (createdUser) res.status(201).json(createdUser)
})
usersRouter.delete('/:id', deleteUserValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedUser = await usersService.deleteUser(req.params.id)
    if (!isDeletedUser) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})