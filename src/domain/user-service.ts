import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt"
import {EmailConfirmationClass, UserAccountClass, UserClass} from "../types/types";
import {ObjectId} from "mongodb";

class UsersService {
    async createUser(login: string, password: string, email: string): Promise<string | null> {
        const isFreeLoginAndEmail: boolean = await usersRepository.isFreeLoginAndEmail(login, email)
        if (!isFreeLoginAndEmail) return null
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newUserAccount = new UserAccountClass(
            login,
            passwordHash,
            email
        )
        const newEmailConfirmation = new EmailConfirmationClass(
            true,
            '',
            new Date(newUserAccount.createdAt)
        )
        const newUser = new UserClass(
            newUserAccount,
            newEmailConfirmation
        )

        return await usersRepository.createUserAdm(newUser)
    }

    async deleteUser(_id: string): Promise<boolean> {
        return await usersRepository.deleteUser(new ObjectId(_id))
    }

    async deleteAll() {
        await usersRepository.deleteAll()
    }
}

export const usersService = new UsersService()