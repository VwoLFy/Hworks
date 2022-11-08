import {userCollection} from "./db";

export const loginRepository = {
    async getPassword(login: string): Promise<string> {
        const user = await userCollection.findOne({login: login})
        if (user) return user.password
        return ''
    }
}