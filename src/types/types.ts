import {Request} from "express";
import {URIParamsModelType} from "../models/URIParamsModel";
import {ObjectId} from "mongodb";
import {RefreshTokenDataType} from "../application/jwt-service";
import {HydratedDocument, Model} from "mongoose";
import {SortDirection} from "./enums";

export type RequestWithParam = Request<URIParamsModelType>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<URIParamsModelType, {}, B>
export type RequestWithParamAndQuery<Q> = Request<URIParamsModelType, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>

export type UserType = {
    accountData: UserAccountType
    emailConfirmation: EmailConfirmationType
}
export type UserAccountType = {
    login: string
    passwordHash: string
    email: string
    createdAt: string
}
export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}

export interface BlogType {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type SessionType = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}
export type ShortSessionDataType = RefreshTokenDataType
export type AttemptsDataType = {
    ip: string
    url: string
    date: Date
}
export type PasswordRecoveryType = {
    email: string
    recoveryCode: string
    expirationDate: Date
}

export type UserDBType = UserType & { _id: ObjectId }
export type SessionDBType = SessionType & { _id: ObjectId }

export type UserWithIdType = UserType & { id: string }
export type BlogWithIdType = BlogType & { id: string }
export type PostWithIdType = PostType & { id: string }

//blogs-----------------------------
export interface BlogMethodsType {
    updateBlog(dto: UpdateBlogTypeM): void
}
export interface BlogModelType extends Model<BlogType, {}, BlogMethodsType> {
    createBlog(dto: CreateBlogTypeM): HDBlogType

    findBlogWithId(id: string): Promise<BlogWithIdType | null>

    findBlogsWithId(dto: FindBlogsType): Promise<BlogWithIdType[]>

    findBlogNameById(id: string): Promise<string | null>

    findHDBlog(id: string): Promise<HDBlogType | null>
}
export type HDBlogType = HydratedDocument<BlogType, BlogMethodsType>

export type UpdateBlogTypeM = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogTypeM = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsType = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

//posts-----------------------------
export interface PostMethodsType {
    updatePost(dto: UpdatePostTypeM): void
}
export interface PostModelType extends Model<PostType, {}, PostMethodsType> {
    createPost(dto: CreatePostTypeM): HDPostType

    findHDPost(id: string): Promise<HDPostType | null>

    isPostExist(id: string): Promise<boolean>

    findPostsWithId(dto: FindPostsType): Promise<PostWithIdType[]>

    findPostWithId(id: string): Promise<PostWithIdType | null>

    findPostsByBlogId(dto: FindPostsByBlogIdType): Promise<PostWithIdType[] | null>
}
export type HDPostType = HydratedDocument<PostType, PostMethodsType>

export type CreatePostTypeM = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type UpdatePostTypeM = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type CreatePostsByBlogIdR = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type UpdatePostTypeR = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type FindPostsType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}
export type FindPostsByBlogIdType = {
    blogId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

//attempts-----------------------------
export interface AttemptsDataMethodsType {
}
export interface AttemptsDataModelType extends Model<AttemptsDataType, {}, AttemptsDataMethodsType> {
    findAttempts(ip: string, url: string): Promise<number>

    addAttemptToList(ip: string, url: string): void
}

export class CommentClass {
    _id: ObjectId
    createdAt: string

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                public postId: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}