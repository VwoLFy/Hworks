import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt"
import {UserAccountType} from "../types/types";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<string | null> {
        const isFreeLoginAndEmail: boolean = await usersRepository.isFreeLoginAndEmail(login, email)
        if (!isFreeLoginAndEmail) return null
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const newUser: UserAccountType = {
            login,
            passwordHash,
            email,
            createdAt: (new Date()).toISOString(),
        }
        return await usersRepository.createUserAdm(newUser)
},
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async deleteAll() {
        await usersRepository.deleteAll()
    }
}