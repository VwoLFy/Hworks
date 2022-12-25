import {UsersRepository} from "../../users/repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid'
import add from "date-fns/add";
import {EmailManager} from "../managers/email-manager";
import {JwtService} from "../application/jwt-service";
import {SecurityService} from "../../security/domain/security-service";
import {PasswordRecoveryClass} from "../types/types";
import {CreateUserDtoType, EmailConfirmationClass, UserAccountClass, UserClass} from "../../users/types/types";
import {PasswordRecoveryModel} from "../types/mongoose-schemas-models";

export class AuthService{
    constructor(protected jwtService: JwtService,
                protected usersRepository: UsersRepository,
                protected emailManager: EmailManager,
                protected securityService: SecurityService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser: UserClass | null = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!foundUser ||
            !foundUser.emailConfirmation.isConfirmed ||
            !await bcrypt.compare(password, foundUser.accountData.passwordHash)) return null
        return foundUser._id.toString()
    }
    async createUser({login, password, email}: CreateUserDtoType): Promise<boolean> {
        const passwordHash = await this.getPasswordHash(password)

        const newUserAccount = new UserAccountClass(
            login,
            passwordHash,
            email
        )
        const newEmailConfirmation = new EmailConfirmationClass(
            false,
            uuidv4(),
            add(new Date(), {hours: 1})
        )
        const newUser = new UserClass(
            newUserAccount,
            newEmailConfirmation
        )
        const newUserId = await this.usersRepository.createUser(newUser)

        try {
            await this.emailManager.sendEmailConfirmationMessage(email, newUser.emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await this.usersRepository.deleteUser(newUserId)
            return false
        }
        return true
    }
    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const emailConfirmation: EmailConfirmationClass | null = await this.usersRepository.findEmailConfirmationByCode(confirmationCode)
        if (!emailConfirmation) return false

        return await this.usersRepository.updateConfirmation(confirmationCode)
    }
    async registrationResendEmail(email: string): Promise<boolean> {
        const foundUser: UserClass | null = await this.usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return false
        if (!foundUser.emailConfirmation) return false

        foundUser.emailConfirmation.expirationDate = add(new Date(), {hours: 1})
        foundUser.emailConfirmation.confirmationCode = uuidv4()
        await this.usersRepository.updateEmailConfirmation(foundUser)

        try {
            await this.emailManager.sendEmailConfirmationMessage(email, foundUser.emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            await this.usersRepository.deleteUser(foundUser._id)
            return false
        }
        return true
    }
    async getPasswordHash(password: string): Promise<string> {
        const passwordSalt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, passwordSalt)
    }
    async loginUser(userId: string, ip: string, title: string) {
        const tokens = await this.jwtService.createJWT(userId, null)
        const refreshTokenData = await this.jwtService.getRefreshTokenData(tokens.refreshToken)
        await this.securityService.saveSession({...refreshTokenData, ip, title})
        return tokens
    }
    async passwordRecoverySendEmail(email: string) {
        const isUserExist = await this.usersRepository.findUserByLoginOrEmail(email)
        if (!isUserExist) return
        const passwordRecovery = new PasswordRecoveryClass(email)
        await PasswordRecoveryModel.create(passwordRecovery)

        try {
            await this.emailManager.sendEmailPasswordRecoveryMessage(email, passwordRecovery.recoveryCode)
        } catch (e) {
            console.log(e)
            return
        }
    }
    async changePassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const passwordRecovery: PasswordRecoveryClass | null = await PasswordRecoveryModel.findPassRecovery(recoveryCode)
        if (!passwordRecovery) return false
        if (new Date() > passwordRecovery.expirationDate) {
            await PasswordRecoveryModel.deletePassRecovery(recoveryCode)
            return false
        }

        const passwordHash = await this.getPasswordHash(newPassword)
        await this.usersRepository.updatePassword(passwordRecovery.email, passwordHash)
        await PasswordRecoveryModel.deletePassRecovery(recoveryCode)
        return true
    }
}