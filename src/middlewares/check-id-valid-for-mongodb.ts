import {NextFunction, Response} from "express";
import {ObjectId} from "mongodb";
import {RequestWithParam} from "../types";

export const checkIdValidForMongodb = (req: RequestWithParam, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
    } else {
        next()
    }
}