import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

type TypeError = {
    message: string
    field: string
}
type TypeErrorResult = {
    errorsMessages: Array<TypeError>
}
const apiErrorResult: TypeErrorResult = {
    errorsMessages: []
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const newRes = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            }
        }
    })
    apiErrorResult.errorsMessages = newRes(req).array({onlyFirstError: true})

    if (apiErrorResult.errorsMessages.length > 0) {
        return res.status(400).json(apiErrorResult);
    } else {
        next()
    }
}