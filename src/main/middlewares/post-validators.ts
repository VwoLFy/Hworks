//post
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {body, CustomValidator, query} from "express-validator";
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {BlogsQueryRepo} from "../../blogs/infrastructure/blogs-queryRepo";
import {LikeStatus, SortDirection} from "../types/enums";
import {container} from "../composition-root";
import {getUserIdAuthMiddleware} from "./get-user-id-auth-middleware";

export const postTitleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols")
    .isString().trim().isLength({min: 1, max: 30});
export const postShortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols")
    .isString().trim().isLength({min: 1, max: 100});
export const postContentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols")
    .isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = async (value) => {
    const foundBlog = await container.resolve(BlogsQueryRepo).findBlogById(value)
    if (!foundBlog) throw new Error();
    return true;
};
const blogIdValidation = body('blogId', "'blogId' must be exist").isMongoId().custom(blogIdIsExist);
const postQueryValidation = [
    query('pageNumber').toInt().default(1).customSanitizer(value => {
        const pageNumber = Number(value)
        return pageNumber < 1 ? 1 : pageNumber
    }),
    query('pageSize').toInt().default(10).customSanitizer(value => {
        const pageSize = Number(value)
        return pageSize < 1 ? 10 : pageSize
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
const likeValidation = body('likeStatus', "'likeStatus' must be one of value: None, Like, Dislike")
    .custom(value => {
        if (![LikeStatus.Like, LikeStatus.None, LikeStatus.Dislike].includes(value)) throw new Error()
        return true
    })

//list for post
export const getPostsValidation = [
    getUserIdAuthMiddleware,
    ...postQueryValidation
]
export const getPostValidation = [
    getUserIdAuthMiddleware,
    checkIdValidForMongodb
    ]
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
export const likePostValidation = [
    checkAuthorizationMiddleware,
    likeValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const deletePostValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]