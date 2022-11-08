import {loginRepository} from "../repositories/login-repository";
import bcrypt from "bcrypt";

export const loginService = {
    async authUser(login: string, password: string): Promise<boolean> {
        const passwordHashFromDb = await loginRepository.getPassword(login)
        return !(!passwordHashFromDb || ! await bcrypt.compare(password, passwordHashFromDb));
    }
}