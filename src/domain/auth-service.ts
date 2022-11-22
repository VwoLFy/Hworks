import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";

export type TypeNewUser = {
    accountData: TypeUserAccountType
    emailConfirmation: TypeEmailConfirmation
}
export type TypeUserAccountType = {
    login: string
    passwordHash: string
    email: string
    createdAt: string
}
export type TypeEmailConfirmation = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date | null
    timeEmailResending: Date | null
}
type TypeUser = TypeNewUser & { id: string }

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser: TypeUser | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!foundUser ||
            !foundUser.emailConfirmation.isConfirmed ||
            !await bcrypt.compare(password, foundUser.accountData.passwordHash)) return null
        return foundUser.id.toString()
    },
    async createUser(login: string, password: string, email: string): Promise<boolean> {
        const passwordHash = await this.getPasswordHash(password)

        const newUser: TypeNewUser = {
            accountData: {
                login,
                passwordHash,
                email,
                createdAt: (new Date()).toISOString(),
            },
            emailConfirmation: {
                isConfirmed: false,
                expirationDate: add(new Date(), {hours: 1}),
                confirmationCode: uuidv4(),
                timeEmailResending: null,
            }
        }
        const newUserId = await usersRepository.createUser(newUser)

        try {
            await emailManager.sendEmailConfirmationMessage(email, newUser.emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await usersRepository.deleteUser(newUserId)
            return false
        }
        return true
    },
    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const emailConfirmation: TypeEmailConfirmation | null = await usersRepository.findEmailConfirmationByCode(confirmationCode)
        if (!emailConfirmation) return false

        return await usersRepository.updateConfirmation(confirmationCode)
    },
    async registrationResendEmail(email: string): Promise<boolean> {
        const foundUser: TypeUser | null = await usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return false

        if (!foundUser.emailConfirmation || foundUser.emailConfirmation.timeEmailResending! > new Date()) return false

        foundUser.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
        foundUser.emailConfirmation.confirmationCode = uuidv4()
        foundUser.emailConfirmation.timeEmailResending = add(new Date(), {minutes: 1})
        await usersRepository.updateEmailConfirmation(foundUser)

        try {
            await emailManager.sendEmailConfirmationMessage(email, foundUser.emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await usersRepository.deleteUser(foundUser.id)
            return false
        }
        return true
    },
    async getPasswordHash(password: string): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, passwordSalt)
    },
}