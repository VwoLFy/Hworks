import {UsersRepository} from "../infrastructure/users-repository";
import bcrypt from "bcrypt"
import {ObjectId} from "mongodb";
import {CreateUserDto} from "./dto/CreateUserDto";
import {inject, injectable} from "inversify";
import {User, UserModel} from "../domain/user.schema";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {}

    async createUser(dto: CreateUserDto): Promise<string | null> {
        const {login, password, email} = dto

        const isFreeLoginAndEmail: boolean = await this.usersRepository.isFreeLoginAndEmail(login, email)
        if (!isFreeLoginAndEmail) return null

        const passwordHash = await this.getPasswordHash(password)

        const newUser = new User(login, passwordHash, email, true)
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