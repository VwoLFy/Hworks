import {NextFunction, Response} from "express";
import {ObjectId} from "mongodb";
import {RequestWithParam} from "../types/types";
import {HTTP_Status} from "../types/enums";

export const checkIdValidForMongodb = (req: RequestWithParam, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(HTTP_Status.NOT_FOUND_404)
    } else {
        next()
    }
}