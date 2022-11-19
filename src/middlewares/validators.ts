import {body, CustomValidator, query} from "express-validator";
import {checkIdValidForMongodb} from "./check-id-valid-for-mongodb";
import {checkAuthorizationMiddleware} from "./check-authorization-middleware";
import {blogsQueryRepo} from "../repositories/blogs-queryRepo";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {SortDirection} from "../enums";
import {emailConfirmationUserRepository} from "../repositories/emailConfirmationUser-repository";
import {usersRepository} from "../repositories/users-repository";

// blog
const blogNameValidation = body('name', "'name' must be a string in range from 1 to 15 symbols")
    .isString().trim().isLength({min: 1, max: 15});
const blogDescriptionValidation = body('description', "'description' must be a string in range from 1 to 500 symbols")
    .isString().trim().isLength({min: 1, max: 500});
const blogWebsiteUrlValidation = body('websiteUrl', "'websiteUrl' must be a string in range from 1 to 100 symbols")
    .isString().trim().matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$").isLength({min: 1, max: 100});
const blogQueryValidation = [
    query('pageNumber').toInt().default("1").customSanitizer(value => {
        return Number(value) < 1 ? "1" : value
    }),
    query('pageSize').toInt().default("10").customSanitizer(value => {
        return Number(value) < 1 ? "10" : value
    }),
    query('sortBy').customSanitizer(value => {
        const fields = ['id', 'name', 'websiteUrl', 'createdAt'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        if (!value || value !== SortDirection.asc) return SortDirection.desc
        return SortDirection.asc
    }),
]

//post
const postTitleValidation = body('title', "'title' must be  a string in range from 1 to 30 symbols")
    .isString().trim().isLength({min: 1, max: 30});
const postShortDescriptionValidation = body('shortDescription', "'shortDescription' must be a string in range from 1 to 100 symbols")
    .isString().trim().isLength({min: 1, max: 100});
const postContentValidation = body('content', "'content' must be a string  in range from 1 to 1000 symbols")
    .isString().trim().isLength({min: 1, max: 1000});
const blogIdIsExist: CustomValidator = async (value) => {
    const foundBlog = await blogsQueryRepo.findBlogById(value)
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

//user
const userQueryValidation = [
    query('pageNumber').toInt().default("1").customSanitizer(value => {
        return Number(value) < 1 ? "1" : value
    }),
    query('pageSize').toInt().default("10").customSanitizer(value => {
        return Number(value) < 1 ? "10" : value
    }),
    query('sortBy').customSanitizer(value => {
        const fields = ['id', 'login', 'email', 'createdAt'];
        if (!value || !fields.includes(value)) return 'createdAt'
        return value
    }),
    query('sortDirection').customSanitizer(value => {
        if (!value || value !== SortDirection.asc) return SortDirection.desc
        return SortDirection.asc
    }),
]
const userLoginValidation = body("login", "'login' must be a string in range from 3 to 10 symbols")
    .isString().trim().matches("^[a-zA-Z0-9_-]*$").isLength({min: 3, max: 10});
const userPasswordValidation = body("password", "'password' must be a string in range from 6 to 20 symbols")
    .isString().trim().isLength({min: 6, max: 20});
const userEmailValidation = body("email", "'email' must be a email")
    .isString().trim().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

//auth
const authLoginOrEmail = body("loginOrEmail", "'loginOrEmail' must be a string")
    .isString().trim().isLength({min: 3})
const authPassword = body("password", "'password' must be a string")
    .isString().trim().isLength({min: 6, max: 20})
const codeValid: CustomValidator = async (value) => {
    const emailConfirmation = await emailConfirmationUserRepository.findEmailConfirmationByCode(value)
    if (!emailConfirmation) throw new Error()
    const isConfirmed = await usersRepository.findConfirmById(emailConfirmation.userId)
    if (isConfirmed) throw new Error()
    if (emailConfirmation.expirationDate < new Date()) throw new Error()
    if (emailConfirmation.confirmationCode !== value) throw new Error()
    return true
}
const authCodeValidation = body("code", "'code' confirmation code is incorrect, expired or already been applied").isString()
    //.custom(codeValid)

//comments
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

//list for blog
export const getBlogsValidation = blogQueryValidation
export const getBlogValidation = checkIdValidForMongodb
export const getPostsByBlogIdValidation = [
    checkIdValidForMongodb,
    ...blogQueryValidation
]
export const createPostsByBlogIdValidation = [
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

//list for user
export const getUsersValidation = userQueryValidation
export const createUserValidation = [
    checkAuthorizationMiddleware,
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware
]
export const deleteUserValidation = [
    checkAuthorizationMiddleware,
    checkIdValidForMongodb
]

// list for auth
export const loginAuthValidation = [
    authLoginOrEmail,
    authPassword,
    inputValidationMiddleware
]
export const registrationAuthValidation = [
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware
]
export const emailConfirmationAuthValidation = [
    authCodeValidation,
    inputValidationMiddleware
]
export const emailResendingAuthValidation = [
    userEmailValidation,
    inputValidationMiddleware
]
export const getAuthValidation = [
    checkAuthorizationMiddleware
]

//list for comment
export const createCommentValidation = [
    checkAuthorizationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    checkIdValidForMongodb
]
export const getCommentByPostIdValidation = [
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