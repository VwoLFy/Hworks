import {Request} from "express";
import {TypeURIParamsModel} from "../models/URIParamsModel";
import {ObjectId} from "mongodb";

export type RequestWithParam= Request<TypeURIParamsModel>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<TypeURIParamsModel, {}, B>
export type RequestWithParamAndQuery<Q> = Request<TypeURIParamsModel, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>
export type TypeUserDB = {
    _id: ObjectId
    accountData: TypeUserAccountType
    emailConfirmation: TypeEmailConfirmation
    oldRefreshTokensBL: Array<string>
}
export type TypeUserAccountType = {
    login: string
    passwordHash: string
    email: string
    createdAt: string
}
export type TypeEmailConfirmation = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date | null
    timeEmailResending: Date | null
}
export type TypeBlogDB = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}
