import {Router} from "express";
import {createUserValidation, deleteUserValidation, getUsersValidation} from "../../main/middlewares/user-auth-validators";
import {container} from "../../main/composition-root";
import {UsersController} from "./users-controller";

const usersController = container.resolve(UsersController)

export const usersRouter = Router({})

usersRouter.get('/', getUsersValidation, usersController.getUsers.bind(usersController))
usersRouter.post('/', createUserValidation, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', deleteUserValidation, usersController.deleteUser.bind(usersController))