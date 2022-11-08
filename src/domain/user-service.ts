import {usersRepository} from "../repositories/users-repository";

export type TypeNewUser = {
    login: string
    password: string
    email: string
    createdAt: string
}

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<string> {
        const newUser: TypeNewUser = {
            login,
            password,
            email,
            createdAt: (new Date()).toISOString()
        }
        return await usersRepository.createUser(newUser)
},
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async deleteAll() {
        await usersRepository.deleteAll()
    }
}