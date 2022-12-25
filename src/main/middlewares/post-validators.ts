//post
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {body, CustomValidator, query} from "express-validator";
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {BlogsQueryRepo} from "../../blogs/repositories/blogs-queryRepo";
import {SortDirection} from "../types/enums";

export const postTitleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols")
    .isString().trim().isLength({min: 1, max: 30});
export const postShortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols")
    .isString().trim().isLength({min: 1, max: 100});
export const postContentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols")
    .isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = async (value) => {
    const foundBlog = await new BlogsQueryRepo().findBlogById(value)
    if (!foundBlog) throw new Error();
    return true;
};
const blogIdValidation = body('blogId', "'blogId' must be exist").isMongoId().custom(blogIdIsExist);
const postQueryValidation = [
    query('pageNumber').toInt().default("1").customSanitizer(value => {
        return Number(value) < 1 ? "1" : value
    }),
    query('pageSize').toInt().default("10").customSanitizer(value => {
        return Number(value) < 1 ? "10" : value
    }),
    query('sortBy').customSanitizer(value => {
        const fields = ['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        if (!value || value !== SortDirection.asc) return SortDirection.desc
        return SortDirection.asc
    }),
]
//list for post
export const getPostsValidation = postQueryValidation
export const getPostValidation = checkIdValidForMongodb
export const createPostValidation = [
    checkAuthorizationMiddleware,
    blogIdValidation,
    postTitleValidation,
    postShortDescriptionValidation,
    postContentValidation,
    inputValidationMiddleware
]
export const updatePostValidation = [
    checkAuthorizationMiddleware,
    blogIdValidation,
    postTitleValidation,
    postShortDescriptionValidation,
    postContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const deletePostValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]