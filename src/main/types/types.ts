import {Request} from "express";
import {URIParamsModelType} from "../models/URIParamsModel";
import {ObjectId} from "mongodb";
import {RefreshTokenDataType} from "../../auth/application/jwt-service";
import {HydratedDocument, Model} from "mongoose";
import {LikeStatus, SortDirection} from "./enums";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export type RequestWithParam = Request<URIParamsModelType>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<URIParamsModelType, {}, B>
export type RequestWithParamAndQuery<Q> = Request<URIParamsModelType, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>

export class LikesInfoClass {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus

    constructor() {
        this.likesCount = 0
        this.dislikesCount = 0
        this.myStatus = LikeStatus.None
    }
}
export class CommentClass {
    _id: ObjectId
    createdAt: string

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                public postId: string,
                public likesInfo: LikesInfoClass) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}
export class SessionClass {
    _id: ObjectId
    constructor(public userId: string,
                public exp: number,
                public ip: string,
                public title: string,
                public iat: number,
                public deviceId: string) {
        this._id = new ObjectId()
    }
}
export class UserAccountClass {
    createdAt: string

    constructor(public login: string,
                public passwordHash: string,
                public email: string) {
        this.createdAt = new Date().toISOString()
    }
}
export class EmailConfirmationClass {
    constructor(public isConfirmed: boolean,
                public confirmationCode: string,
                public expirationDate: Date) {
    }
}
export class UserClass {
    _id: ObjectId

    constructor(public accountData: UserAccountClass,
                public emailConfirmation: EmailConfirmationClass) {
        this._id = new ObjectId()
    }
}
export class PasswordRecoveryClass {
    recoveryCode: string
    expirationDate: Date

    constructor(public email: string,
    ) {
        this.recoveryCode = uuidv4()
        this.expirationDate = add(new Date(), {hours: 24})
    }
}
export class BlogClass {
    _id: ObjectId
    createdAt: string

    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}
export class PostClass {
    _id: ObjectId
    createdAt: string

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}
export class LikeClass {
    createdAt: Date

    constructor(public commentId: string,
                public userId: string,
                public likeStatus: LikeStatus) {
        this.createdAt = new Date()
    }
}


//blogs-----------------------------
export type BlogWithIdType = Omit<BlogClass, '_id'> & { id: string }
export interface BlogMethodsType {
    updateBlog(dto: UpdateBlogDtoType): void
}
export interface BlogModelType extends Model<BlogClass, {}, BlogMethodsType> {
    findBlogWithId(_id: ObjectId): Promise<BlogWithIdType | null>
    findBlogsWithId(dto: FindBlogsDtoType): Promise<BlogWithIdType[]>
    findBlogNameById(id: string): Promise<string | null>
    findHDBlog(id: string): Promise<HDBlogType | null>}
export type HDBlogType = HydratedDocument<BlogClass, BlogMethodsType>

//posts-----------------------------
export type PostWithIdType = Omit<PostClass, '_id'> & { id: string }
export interface PostMethodsType {
    updatePost(dto: UpdatePostDto): void
}
export interface PostModelType extends Model<PostClass, {}, PostMethodsType> {
    findHDPost(id: string): Promise<HDPostType | null>
    isPostExist(id: string): Promise<boolean>
    findPostsWithId(dto: FindPostsDtoType): Promise<PostWithIdType[]>
    findPostWithId(_id: ObjectId): Promise<PostWithIdType | null>
    findPostsByBlogId(dto: FindPostsByBlogIdDtoType): Promise<PostWithIdType[] | null>}
export type HDPostType = HydratedDocument<PostClass, PostMethodsType>

//attempts-----------------------------
export interface AttemptsDataMethodsType {
}
export interface AttemptsDataModelType extends Model<AttemptsDtoType, {}, AttemptsDataMethodsType> {
    findAttempts(ip: string, url: string): Promise<number>
    addAttemptToList(ip: string, url: string): Promise<void>
}

//password-recovery
export interface PasswordRecoveryModelType extends Model<PasswordRecoveryClass> {
    findPassRecovery(recoveryCode: string): Promise<PasswordRecoveryClass | null>
    deletePassRecovery(recoveryCode: string): Promise<void>
}


//DTO----------------------------------
export type SessionDtoType = {
    userId: string
    exp: number
    ip: string
    title: string
    iat: number
    deviceId: string
}
export type ShortSessionDtoType = RefreshTokenDataType
export interface AttemptsDtoType {
    ip: string
    url: string
    date: Date
}

export type UpdateBlogDtoType = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogDtoType = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsDtoType = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

export type UpdatePostDto = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName?: string
}
export type CreatePostDtoType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type FindPostsDtoType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}
export type FindPostsByBlogIdDtoType = {
    blogId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}

export type LikeCommentDtoType = {
    commentId: string
    userId: string
    likeStatus: LikeStatus
}
export type CreateCommentDtoType = {
    postId: string
    content: string
    userId: string
}
export type UpdateCommentDtoType = {
    commentId: string
    content: string
    userId: string
}
export type FindCommentsDtoType = {
    postId: string
    page: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    userId: string | null
}

export type CreateUserDtoType = {
    login: string
    password: string
    email: string
}
export type FindUsersDtoType = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
    searchLoginTerm: string,
    searchEmailTerm: string
}