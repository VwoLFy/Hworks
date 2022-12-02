import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsValidator = async (req: Request, res: Response, next: NextFunction) => {
    const attemptsList: Array<number> = await attemptsRepository.findAttemptsListByIp(req.ip) //accessAllowed
    if (attemptsList.length === 5) {
        const currentTime = Number(new Date())
        const newAttemptsList = attemptsList.filter(att => currentTime - att <= 10000)
        if (newAttemptsList.length === 5) {
            res.sendStatus(HTTP_Status.TOO_MANY_REQUESTS_429)
            return
        }
        await attemptsRepository.updateAttemptsList(req.ip, newAttemptsList)
    }
    if (attemptsList.length === 0) {
        await attemptsRepository.createAttemptsList(req.ip)
    } else {
        await attemptsRepository.addAttemptToList(req.ip)
    }
    next()
    return
}