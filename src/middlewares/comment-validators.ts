//comments
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {body, query} from "express-validator";
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {SortDirection} from "../types/enums";

const commentContentValidation = body('content', "'content' must be a string  in range from 20 to 300 symbols")
    .isString().trim().isLength({min: 20, max: 300});
const commentQueryValidation = [
    query("pageNumber").toInt().default("1").customSanitizer((value) => {
        return Number(value) < 1 ? "1" : value
    }),
    query("pageSize").toInt().default("10").customSanitizer((value) => {
        return Number(value) < 1 ? "10" : value
    }),
    query("sortBy").customSanitizer(value => {
        const isInArray = ['id', 'content', 'userId', 'userLogin', 'createdAt'].includes(value)
        return isInArray ? value : 'createdAt'
    }),
    query("sortDirection").customSanitizer(value => SortDirection.asc === value ? SortDirection.asc : SortDirection.desc),
]
//list for comment
export const createCommentValidation = [
    checkAuthorizationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const getCommentsByPostIdValidation = [
    checkIdValidForMongodb,
    ...commentQueryValidation
]
export const getCommentByIdValidation = [
    checkIdValidForMongodb
]
export const updateCommentByIdValidation = [
    checkAuthorizationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const deleteCommentByIdValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]