import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt"
import {emailConfirmationUserRepository} from "../repositories/emailConfirmationUser-repository";

export type TypeNewUser = {
    login: string
    passwordHash: string
    email: string
    createdAt: string
    isConfirmed: boolean
}

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<string | null> {
        const isFreeLoginAndEmail = await usersRepository.isFreeLoginAndEmail(login, email)
        if (!isFreeLoginAndEmail) return null
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newUser: TypeNewUser = {
            login,
            passwordHash,
            email,
            createdAt: (new Date()).toISOString(),
            isConfirmed: true
        }
        return await usersRepository.createUser(newUser)
},
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async deleteAll() {
        await usersRepository.deleteAll()
        await emailConfirmationUserRepository.deleteAll()
    }
}