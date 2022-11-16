import {Response, Router} from "express";
import {RequestWithBody, RequestWithParam, RequestWithQuery} from "../types/types";
import {TypeUserViewModelPage} from "../models/UserViewModelPage";
import {TypeUserQueryModel} from "../models/UserQueryModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../middlewares/validators";
import {TypeUserInputModel} from "../models/UserInputModel";
import {TypeUserViewModel} from "../models/UserViewModel";
import {usersService} from "../domain/user-service";
import {HTTP_Status} from "../enums";

export const usersRouter = Router({})

usersRouter.get('/', getUsersValidation, async (req: RequestWithQuery<TypeUserQueryModel>, res: Response<TypeUserViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
    res.json( await usersQueryRepo.findUsers(+pageNumber, +pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) )
})
usersRouter.post('/', createUserValidation, async (req: RequestWithBody<TypeUserInputModel>, res: Response<TypeUserViewModel>) => {
    const createdUserId = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    if (!createdUserId) return res.sendStatus(HTTP_Status.BAD_REQUEST_400)
    const createdUser = await usersQueryRepo.findUserById(createdUserId)
    if (createdUser) res.status(HTTP_Status.CREATED_201).json(createdUser)
})
usersRouter.delete('/:id', deleteUserValidation, async (req: RequestWithParam, res: Response) => {
    const isDeletedUser = await usersService.deleteUser(req.params.id)
    if (!isDeletedUser) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        res.sendStatus(HTTP_Status.NO_CONTENT_204)
    }
})