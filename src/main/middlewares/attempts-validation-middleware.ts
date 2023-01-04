import {NextFunction, Request, Response} from "express";
import {HTTP_Status} from "../types/enums";
import {container} from "../composition-root";
import {AttemptsService} from "../../auth/application/attempts-service";
import {AttemptsDataDto} from "../../auth/application/dto/AttemptsDataDto";

export const attemptsValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const attemptsService = container.resolve(AttemptsService)
    const dto: AttemptsDataDto = {
        ip: req.ip,
        url: req.url
    }

    await attemptsService.addAttemptToList(dto)

    const countAttempts = await attemptsService.findAttempts(dto)
    if (countAttempts > 5) {
        res.sendStatus(HTTP_Status.TOO_MANY_REQUESTS_429)
        return
    }
    next()
}