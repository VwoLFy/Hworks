import {UsersRepository} from "../../users/infrastructure/users-repository";
import bcrypt from "bcrypt";
import {EmailManager} from "./email-manager";
import {JwtService} from "./jwt-service";
import {SecurityService} from "../../security/application/security-service";
import {CreateUserDto} from "../../users/application/dto/CreateUserDto";
import {PasswordRecovery, PasswordRecoveryModel} from "../domain/password-recovery.schema";
import {inject, injectable} from "inversify";
import {User, UserModel} from "../../users/domain/user.schema";
import {CredentialsDto} from "./dto/CredentialsDto";
import {NewPasswordRecoveryDto} from "./dto/NewPasswordRecoveryDto";
import {PasswordRecoveryRepository} from "../infrastructure/password-recovery-repository";

@injectable()
export class AuthService{
    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(EmailManager) protected emailManager: EmailManager,
                @inject(PasswordRecoveryRepository) protected passwordRepository: PasswordRecoveryRepository,
                @inject(SecurityService) protected securityService: SecurityService) {}

    async checkCredentials(dto: CredentialsDto): Promise<string | null> {
        const foundUser = await this.usersRepository.findUserByLoginOrEmail(dto.loginOrEmail)
        if (!foundUser ||
            !foundUser.emailConfirmation.isConfirmed ||
            !await bcrypt.compare(dto.password, foundUser.accountData.passwordHash)) return null
        return foundUser.id
    }
    async createUser(dto: CreateUserDto): Promise<boolean> {
        const {login, password, email} = dto
        const passwordHash = await this.getPasswordHash(password)

        const newUser = new User(login, passwordHash, email, false)
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

        const newPasswordRecovery = new PasswordRecovery(email)
        const passwordRecovery = new PasswordRecoveryModel(newPasswordRecovery)
        await this.passwordRepository.savePassRecovery(passwordRecovery)

        try {
            await this.emailManager.sendEmailPasswordRecoveryMessage(email, passwordRecovery.recoveryCode)
        } catch (e) {
            console.log(e)
        }
    }
    async changePassword(dto: NewPasswordRecoveryDto): Promise<boolean> {
        const {newPassword, recoveryCode} = dto

        const passwordRecovery = await this.passwordRepository.findPassRecovery(recoveryCode)
        if (!passwordRecovery) return false

        if (new Date() > passwordRecovery.expirationDate) {
            await this.passwordRepository.deletePassRecovery(recoveryCode)
            return false
        }

        const foundUser = await this.usersRepository.findUserByLoginOrEmail(passwordRecovery.email)
        if (!foundUser) return false

        const passwordHash = await this.getPasswordHash(newPassword)

        foundUser.updatePassword(passwordHash)
        await this.usersRepository.saveUser(foundUser)

        await this.passwordRepository.deletePassRecovery(recoveryCode)
        return true
    }
}