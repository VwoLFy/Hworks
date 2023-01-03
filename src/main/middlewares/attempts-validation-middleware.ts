import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {AttemptsDataModel} from "../types/attemptsdata.schema";

export const attemptsValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    await AttemptsDataModel.addAttemptToList(req.ip, req.url)
    const countAttempts = await AttemptsDataModel.findAttempts(req.ip, req.url)
    if (countAttempts > 5) {
        res.sendStatus(HTTP_Status.TOO_MANY_REQUESTS_429)
        return
    }
    next()
}