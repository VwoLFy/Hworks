import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {TypeEmailConfirmation, TypePasswordRecovery, TypeUser, TypeUserWithId} from "../types/types";
import {jwtService} from "../application/jwt-service";
import {securityService} from "./security-service";
import {PasswordRecoveryModel} from "../types/mongoose-schemas-models";
import {passRecoveryRepository} from "../repositories/pass-recovery-repository";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser: TypeUserWithId | null = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!foundUser ||
            !foundUser.emailConfirmation.isConfirmed ||
            !await bcrypt.compare(password, foundUser.accountData.passwordHash)) return null
        return foundUser.id.toString()
    },
    async createUser(login: string, password: string, email: string): Promise<boolean> {
        const passwordHash = await this.getPasswordHash(password)

        const newUser: TypeUser = {
            accountData: {
                login,
                passwordHash,
                email,
                createdAt: (new Date()).toISOString(),
            },
            emailConfirmation: {
                isConfirmed: false,
                expirationDate: add(new Date(), {hours: 1}),
                confirmationCode: uuidv4()
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
        const foundUser: TypeUserWithId | null = await usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return false
        if (!foundUser.emailConfirmation) return false

        foundUser.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
        foundUser.emailConfirmation.confirmationCode = uuidv4()
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
    async loginUser(userId: string, ip: string, title: string) {
        const tokens = await jwtService.createJWT(userId, null)
        const refreshTokenData = await jwtService.getRefreshTokenData(tokens.refreshToken)
        await securityService.saveSession({...refreshTokenData, ip, title})
        return tokens
    },
    async passwordRecoverySendEmail(email: string) {
        const isUserExist = await usersRepository.findUserByLoginOrEmail(email)
        if (!isUserExist) return

        const passwordRecovery = await PasswordRecoveryModel.create({
            email,
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {hours: 24})
        })
        try {
            await emailManager.sendEmailPasswordRecoveryMessage(email, passwordRecovery.recoveryCode)
        } catch (e) {
            console.log(e)
            return
        }
    },
    async changePassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const passwordRecovery: TypePasswordRecovery | null = await passRecoveryRepository.findPassRecovery(recoveryCode)
        if (!passwordRecovery) return false
        if (new Date() > passwordRecovery.expirationDate) {
            await passRecoveryRepository.deletePassRecovery(recoveryCode)
            return false
        }

        const passwordHash = await this.getPasswordHash(newPassword)
        await usersRepository.updatePassword(passwordRecovery.email, passwordHash)
        await passRecoveryRepository.deletePassRecovery(recoveryCode)
        return true
    }
}