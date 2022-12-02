import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsValidator = async (req: Request, res: Response, next: NextFunction) => {
    //set attempt to DB - ip, url, data
    // read attempts from BD by ip, url, data(< datenow - 10s)
    // if attempts > limit throw error
    await attemptsRepository.addAttemptToList(req.ip, req.url)
    const countAttempts = await attemptsRepository.findAttempts(req.ip, req.url)
    if (countAttempts > 5) {
        res.sendStatus(HTTP_Status.TOO_MANY_REQUESTS_429)
        return
    }
    next()
}