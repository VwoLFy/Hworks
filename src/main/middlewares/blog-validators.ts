import {body, query} from "express-validator";
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {SortDirection} from "../types/enums";
import {postContentValidation, postShortDescriptionValidation, postTitleValidation} from "./post-validators";
import {getUserIdAuthMiddleware} from "./get-user-id-auth-middleware";

const blogNameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
    .isString().trim().isLength({min: 1, max: 15});
const blogDescriptionValidation = body('description', "'description' must be a string in range from 1 to 500 symbols")
    .isString().trim().isLength({min: 1, max: 500});
const blogWebsiteUrlValidation = body('websiteUrl', "'websiteUrl' must be a string in range from 1 to 100 symbols")
    .isString().trim().matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$").isLength({
        min: 1,
        max: 100
    });
const blogQueryValidation = [
    query('pageNumber').toInt().default(1).customSanitizer(value => {
        const pageNumber = Number(value)
        return pageNumber < 1 ? 1 : pageNumber
    }),
    query('pageSize').toInt().default(10).customSanitizer(value => {
        const pageSize = Number(value)
        return pageSize < 1 ? 10 : pageSize
    }),
    query('sortBy').customSanitizer(value => {
        const fields = ['id', 'name', 'websiteUrl', 'createdAt', 'isMembership'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        if (!value || value !== SortDirection.asc) return SortDirection.desc
        return SortDirection.asc
    }),
]
//list for blog
export const getBlogsValidation = blogQueryValidation
export const getBlogValidation = checkIdValidForMongodb
export const getPostsByBlogIdValidation = [
    getUserIdAuthMiddleware,
    checkIdValidForMongodb,
    ...blogQueryValidation
]
export const createPostsByBlogIdValidation = [
    getUserIdAuthMiddleware,
    checkAuthorizationMiddleware,
    postTitleValidation,
    postShortDescriptionValidation,
    postContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const createBlogValidation = [
    checkAuthorizationMiddleware,
    blogNameValidation,
    blogDescriptionValidation,
    blogWebsiteUrlValidation,
    inputValidationMiddleware
]
export const updateBlogValidation = [
    checkAuthorizationMiddleware,
    blogNameValidation,
    blogDescriptionValidation,
    blogWebsiteUrlValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const deleteBlogValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]