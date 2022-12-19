import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt"
import {EmailConfirmationClass, UserAccountClass, UserClass} from "../types/types";
import {ObjectId} from "mongodb";

export class UsersService {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository()
    }

    async createUser(login: string, password: string, email: string): Promise<string | null> {
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