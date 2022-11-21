import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add";
import {emailConfirmationUserRepository} from "../repositories/emailConfirmationUser-repository";
import {TypeNewUser} from "./user-service";
import {emailManager} from "../managers/email-manager";

type TypeUser = TypeNewUser & {
    id: string
}
export type TypeEmailConfirmation = {
    expirationDate: Date
    confirmationCode: string
    timeEmailResending: Date
    userId: string
}

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!foundUser ||
            !foundUser.isConfirmed ||
            !await bcrypt.compare(password, foundUser.passwordHash)) return null
        return foundUser.id.toString()
    },
    async createUser(login: string, password: string, email: string): Promise<boolean> {
        const passwordHash = await this.getPasswordHash(password)

        const newUser: TypeNewUser = {
            login,
            passwordHash,
            email,
            createdAt: (new Date()).toISOString(),
            isConfirmed: false
        }
        const newUserId = await usersRepository.createUser(newUser)

        const emailConfirmation: TypeEmailConfirmation = {
            expirationDate: add(new Date(), {hours: 1}),
            confirmationCode: uuidv4(),
            timeEmailResending: new Date(),
            userId: newUserId
        }
        await emailConfirmationUserRepository.createEmailConfirmation(emailConfirmation)

        try {
            await emailManager.sendEmailConfirmationMessage(email, emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await usersRepository.deleteUser(newUserId)
            await emailConfirmationUserRepository.deleteEmailConfirmation(newUserId)
            return false
        }
        return true
    },
    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const emailConfirmation = await emailConfirmationUserRepository.findEmailConfirmationByCode(confirmationCode)
        if (!emailConfirmation) return false

        return await usersRepository.updateConfirmation(emailConfirmation.userId)
    },
    async registrationResendEmail(email: string) {
        const foundUser: TypeUser | null = await usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return false

        const emailConfirmation = await emailConfirmationUserRepository.findEmailConfirmationByUserId(foundUser.id)
        if (!emailConfirmation || emailConfirmation.timeEmailResending > new Date()) return false

        emailConfirmation.expirationDate = add(new Date(), {hours: 1})
        emailConfirmation.confirmationCode = uuidv4()
        emailConfirmation.timeEmailResending = add(new Date(), {minutes: 1})
        await emailConfirmationUserRepository.updateEmailConfirmation(emailConfirmation)

        try {
            await emailManager.sendEmailConfirmationMessage(email, emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await usersRepository.deleteUser(foundUser.id)
            await emailConfirmationUserRepository.deleteEmailConfirmation(foundUser.id)
            return false
        }
        return true
    },
    async getPasswordHash(password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, passwordSalt)
    },
}