import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt"
import {ObjectId} from "mongodb";
import {CreateUserDtoType, EmailConfirmationClass, UserAccountClass, UserClass} from "../types/types";

export class UsersService {
    constructor(protected usersRepository: UsersRepository) {}

    async createUser({login, password, email}: CreateUserDtoType): Promise<string | null> {
        const isFreeLoginAndEmail: boolean = await this.usersRepository.isFreeLoginAndEmail(login, email)
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

        return await this.usersRepository.createUserAdm(newUser)
    }
    async deleteUser(_id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(new ObjectId(_id))
    }
    async deleteAll() {
        await this.usersRepository.deleteAll()
    }
}