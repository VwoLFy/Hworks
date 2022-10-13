import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

type typeError = {
    message: string
    field: string
}
type typeErrorResult = {
    errorsMessages: Array<typeError>
}
const apiErrorResult: typeErrorResult = {
    errorsMessages: []
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    apiErrorResult.errorsMessages.splice(0);
    const errors = validationResult(req).array({onlyFirstError: true});
    for (const error of errors) {
        apiErrorResult.errorsMessages.push({
            message: error.msg,
            field: error.param
        })
    }

    if (apiErrorResult.errorsMessages.length > 0) {
        return res.status(400).json(apiErrorResult);
    } else {
        next()
    }
}