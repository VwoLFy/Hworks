import {Router} from "express";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../../main/middlewares/user-auth-validators";
import {usersController} from "../../main/composition-root";

export const usersRouter = Router({})

usersRouter.get('/', getUsersValidation, usersController.getUsers.bind(usersController))
usersRouter.post('/', createUserValidation, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', deleteUserValidation, usersController.deleteUser.bind(usersController))