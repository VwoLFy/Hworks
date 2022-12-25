//comments
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {body, query} from "express-validator";
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {LikeStatus, SortDirection} from "../types/enums";
import {getUserIdAuthMiddleware} from "./get-user-id-auth-middleware";

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

const likeValidation = body('likeStatus',"'likeStatus' must be one of value: None, Like, Dislike")
    .custom(value => {
        if (![LikeStatus.Like, LikeStatus.None, LikeStatus.Dislike].includes(value)) throw new Error()
        return true
    })

//list for comment
export const createCommentValidation = [
    checkAuthorizationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const getCommentsByPostIdValidation = [
    getUserIdAuthMiddleware,
    checkIdValidForMongodb,
    ...commentQueryValidation
]
export const getCommentByIdValidation = [
    getUserIdAuthMiddleware,
    checkIdValidForMongodb
]
export const updateCommentByIdValidation = [
    checkAuthorizationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const likeCommentValidation = [
    checkAuthorizationMiddleware,
    likeValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const deleteCommentByIdValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]