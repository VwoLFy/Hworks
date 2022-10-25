import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const checkIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
    } else {
        next()
    }
}