import mongoose, {HydratedDocument} from "mongoose";
import {
    BlogMethodsType,
    BlogModelType,
    AttemptsDataDBType, BlogType,
    CommentDBType,
    EmailConfirmationType, PasswordRecoveryType,
    PostDBType, SessionDBType,
    UserAccountType,
    UserDBType, UpdateBlogType
} from "./types";

const UserAccountSchema = new mongoose.Schema<UserAccountType>({
    login: {type: String, required: true, minlength: 3, maxlength: 30},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true}
})
const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    isConfirmed: {type: Boolean, required: true},
    confirmationCode: {type: String},
    expirationDate: {type: Date, required: true}
})
const UserSchema = new mongoose.Schema<UserDBType>({
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})
const BlogSchema = new mongoose.Schema<BlogType, BlogModelType, BlogMethodsType>({
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {type: String, required: true, maxlength: 100},
    createdAt: {type: String, required: true}
})
BlogSchema.methods.updateBlog = function (dto: UpdateBlogType) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
}
BlogSchema.statics.createBlog = function (dto: UpdateBlogType): Promise<HydratedDocument<BlogType, BlogMethodsType>> {
    return BlogModel.create({
        ...dto,
        createdAt: new Date().toISOString()
    })
}
const PostSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
const CommentSchema = new mongoose.Schema<CommentDBType>({
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
})
const SessionSchema = new mongoose.Schema<SessionDBType>({
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
const AttemptsDataSchema = new mongoose.Schema<AttemptsDataDBType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})
const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    email: {type: String, required: true},
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})

export const UserModel = mongoose.model('users', UserSchema)
export const BlogModel = mongoose.model<BlogType, BlogModelType>('blogs', BlogSchema)
export const PostModel = mongoose.model('posts', PostSchema)
export const CommentModel = mongoose.model('comments', CommentSchema)
export const SessionModel = mongoose.model('sessions', SessionSchema)
export const AttemptsDataModel = mongoose.model('attempts_data', AttemptsDataSchema)
export const PasswordRecoveryModel = mongoose.model('pass_recovery', PasswordRecoverySchema)