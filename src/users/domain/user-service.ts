import {UsersRepository} from "../infrastructure/users-repository";
import bcrypt from "bcrypt"
import {ObjectId} from "mongodb";
import {CreateUserDTO, EmailConfirmationClass, UserAccountClass, UserClass} from "../types/types";
import {inject, injectable} from "inversify";
import {UserModel} from "../types/mongoose-schemas-models";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {}

    async createUser({login, password, email}: CreateUserDTO): Promise<string | null> {
        const isFreeLoginAndEmail: boolean = await this.usersRepository.isFreeLoginAndEmail(login, email)
        if (!isFreeLoginAndEmail) return null

        const passwordHash = await this.getPasswordHash(password)

        const newUserAccount = new UserAccountClass(login, passwordHash, email)
        const newEmailConfirmation = new EmailConfirmationClass(true)
        const newUser = new UserClass(newUserAccount, newEmailConfirmation)

        const user = new UserModel(newUser)
        await this.usersRepository.saveUser(user)
        return user.id
    }
    async getPasswordHash(password: string): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, passwordSalt)
    }
    async deleteUser(_id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(new ObjectId(_id))
    }
    async deleteAll() {
        await this.usersRepository.deleteAll()
    }
}