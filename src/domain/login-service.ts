import {loginRepository} from "../repositories/login-repository";

export const loginService = {
    async authUser(login: string, password: string): Promise<boolean> {
        const passwordFromDb = await loginRepository.getPassword(login)
        return !(!passwordFromDb || password !== passwordFromDb);
    }
}