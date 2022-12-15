import {Request} from "express";
import {URIParamsModelType} from "../models/URIParamsModel";
import {ObjectId} from "mongodb";
import {RefreshTokenDataType} from "../application/jwt-service";
import {HydratedDocument, Model} from "mongoose";

export type RequestWithParam= Request<URIParamsModelType>
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
export type CommentType = {
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
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

export type UserDBType = UserType & {_id: ObjectId}
export interface BlogDBType extends BlogType {_id: ObjectId}
export type PostDBType = PostType & {_id: ObjectId}
export type CommentDBType = CommentType & {_id: ObjectId}
export type SessionDBType = SessionType & {_id: ObjectId}
export type AttemptsDataDBType = AttemptsDataType & {_id: ObjectId}

export type UserWithIdType = UserType & {id: string}
export type BlogWithIdType = BlogType & {id: string}
export type PostWithIdType = PostType & {id: string}
export type CommentWithIdType = CommentType & {id: string}
export type SessionWithIdType = SessionType & {id: string}
export type AttemptsDataWithIdType = AttemptsDataType & {id: string}

export interface BlogMethodsType {
    updateBlog(dto: UpdateBlogType): void
}
export interface BlogModelType extends Model<BlogType, {}, BlogMethodsType> {
    createBlog(dto: UpdateBlogType): HydratedDocument<BlogType, BlogMethodsType>
    findBlogWithId(id: string): Promise<BlogWithIdType | null>
    findBlogsWithId(dto: FindBlogsWithIdType): Promise<BlogWithIdType[]>
    findBlogNameById(id: string): Promise<string | null>
    findHDBlog(id: string): Promise<HDBlogType | null>
}
export type HDBlogType = HydratedDocument<BlogType, BlogMethodsType>

export type UpdateBlogType = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogType = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsWithIdType = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    optionsSort: {}
}
export type FindBlogsType = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}
