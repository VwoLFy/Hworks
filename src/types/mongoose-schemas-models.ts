import mongoose from "mongoose";
import {
    TypeAttemptsDataDB,
    TypeBlogDB, TypeCommentDB,
    TypeEmailConfirmation,
    TypePostDB, TypeSessionDB,
    TypeUserAccount,
    TypeUserDB
} from "./types";

const UserAccountSchema = new mongoose.Schema<TypeUserAccount>({
    login: String,
    passwordHash: String,
    email: String,
    createdAt: String
})
const EmailConfirmationSchema = new mongoose.Schema<TypeEmailConfirmation>({
    isConfirmed: Boolean,
    confirmationCode: String,
    expirationDate: Date
})
const UserSchema = new mongoose.Schema<TypeUserDB>({
    accountData: UserAccountSchema,
    emailConfirmation: EmailConfirmationSchema
})
const BlogSchema = new mongoose.Schema<TypeBlogDB>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String
})
const PostSchema = new mongoose.Schema<TypePostDB>({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})
const CommentSchema = new mongoose.Schema<TypeCommentDB>({
    content: {type: String},
    userId: String,
    userLogin: String,
    createdAt: String,
    postId: String,
})
const SessionSchema = new mongoose.Schema<TypeSessionDB>({
    userId: String,
    exp: Number,
    ip: String,
    title: String,
    iat: Number,
    deviceId: String,
})
const AttemptsDataSchema = new mongoose.Schema<TypeAttemptsDataDB>({
    ip: String,
    url: String,
    date: Date
})

export const UserModel = mongoose.model('users', UserSchema)
export const BlogModel = mongoose.model('blogs', BlogSchema)
export const PostModel = mongoose.model('posts', PostSchema)
export const CommentModel = mongoose.model('comments', CommentSchema)
export const SessionModel = mongoose.model('sessions', SessionSchema)
export const AttemptsDataModel = mongoose.model('attempts_data', AttemptsDataSchema)
