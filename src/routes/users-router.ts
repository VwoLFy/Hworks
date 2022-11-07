import {Response, Router} from "express";
import {RequestWithQuery} from "../types";
import {TypeUserViewModelPage} from "../models/UserViewModelPage";
import {TypeUserQueryModel} from "../models/UserQueryModel";
import {usersQueryRepo} from "../repositories/users-queryRepo";
import {getUsersValidation} from "../middlewares/validators";

export const usersRouter = Router({})

usersRouter.get("/", getUsersValidation, async (req: RequestWithQuery<TypeUserQueryModel>, res: Response<TypeUserViewModelPage>) => {
    const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} = req.query
    res.json( await usersQueryRepo.findUsers(+pageNumber, +pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) )
})