import {Request} from "express";
import {TypeURIParamsModel} from "../models/URIParamsModel";
import {ObjectId} from "mongodb";
import {TypeRefreshTokenData} from "../application/jwt-service";

export type RequestWithParam= Request<TypeURIParamsModel>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<TypeURIParamsModel, {}, B>
export type RequestWithParamAndQuery<Q> = Request<TypeURIParamsModel, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>

export type TypeUser = {
    accountData: TypeUserAccount
    emailConfirmation: TypeEmailConfirmation
}
export type TypeUserAccount = {
    login: string
    passwordHash: string
    email: string
    createdAt: string
}
export type TypeEmailConfirmation = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
}
export type TypeBlog = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}
export type TypePost = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type TypeComment = {
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}
export type TypeSession = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}
export type TypeShortSessionData = TypeRefreshTokenData
export type TypeAttemptsData = {
    ip: string
    url: string
    date: Date
}
export type TypePasswordRecovery = {
    email: string
    recoveryCode: string
    expirationDate: Date
}

export type TypeUserDB = TypeUser & {_id: ObjectId}
export type TypeBlogDB = TypeBlog & {_id: ObjectId}
export type TypePostDB = TypePost & {_id: ObjectId}
export type TypeCommentDB = TypeComment & {_id: ObjectId}
export type TypeSessionDB = TypeSession & {_id: ObjectId}
export type TypeAttemptsDataDB = TypeAttemptsData & {_id: ObjectId}

export type TypeUserWithId = TypeUser & {id: string}
export type TypeBlogWithId = TypeBlog & {id: string}
export type TypePostWithId = TypePost & {id: string}
export type TypeCommentWithId = TypeComment & {id: string}
export type TypeSessionWithId = TypeSession & {id: string}
export type TypeAttemptsDataWithId = TypeAttemptsData & {id: string}