import {UsersRepository} from "../../users/infrastructure/users-repository";
import bcrypt from "bcrypt";
import {EmailManager} from "./email-manager";
import {JwtService} from "./jwt-service";
import {SecurityService} from "../../security/application/security-service";
import {PasswordRecoveryClass} from "../domain/types";
import {CreateUserDTO, EmailConfirmationClass, UserAccountClass, UserClass} from "../../users/domain/types";
import {PasswordRecoveryModel} from "../domain/passwordrecovery.schema";
import {inject, injectable} from "inversify";
import {UserModel} from "../../users/domain/user.schema";

@injectable()
export class AuthService{
    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(EmailManager) protected emailManager: EmailManager,
                @inject(SecurityService) protected securityService: SecurityService) {}

    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const foundUser = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!foundUser ||
            !foundUser.emailConfirmation.isConfirmed ||
            !await bcrypt.compare(password, foundUser.accountData.passwordHash)) return null
        return foundUser.id
    }
    async createUser({login, password, email}: CreateUserDTO): Promise<boolean> {
        const passwordHash = await this.getPasswordHash(password)

        const newUserAccount = new UserAccountClass(login, passwordHash, email)
        const newEmailConfirmation = new EmailConfirmationClass(false)
        const newUser = new UserClass( newUserAccount, newEmailConfirmation)

        const user = new UserModel(newUser)

        try {
            await this.emailManager.sendEmailConfirmationMessage(email, user.emailConfirmation.confirmationCode)
        } catch (e) {
            console.log(e)
            return false
        }

        await this.usersRepository.saveUser(user)
        return true
    }
    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const foundUser = await this.usersRepository.findUserByConfirmationCode(confirmationCode)
        if (!foundUser) return false

        await foundUser.confirmUser()
        await this.usersRepository.saveUser(foundUser)
        return true
    }
    async registrationResendEmail(email: string): Promise<boolean> {
        const foundUser = await this.usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser || !foundUser.emailConfirmation) return false

        foundUser.updateEmailConfirmation()

        try {
            await this.emailManager.sendEmailConfirmationMessage(email, foundUser.emailConfirmation.confirmationCode)
            await this.usersRepository.saveUser(foundUser)
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

        const foundUser = await this.usersRepository.findUserByLoginOrEmail(passwordRecovery.email)
        if (!foundUser) return false

        foundUser.updatePassword(passwordHash)
        await this.usersRepository.saveUser(foundUser)

        await PasswordRecoveryModel.deletePassRecovery(recoveryCode)
        return true
    }
}