import {HydratedDocument, model, Schema} from "mongoose";
import {
    AttemptsDataDBType,
    BlogMethodsType,
    BlogModelType,
    BlogType,
    BlogWithIdType,
    CommentDBType,
    EmailConfirmationType,
    FindBlogsWithIdType, HDBlogType,
    PasswordRecoveryType,
    PostDBType,
    SessionDBType,
    UpdateBlogType,
    UserAccountType,
    UserDBType
} from "./types";

const BlogSchema = new Schema<BlogType, BlogModelType, BlogMethodsType>({
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {type: String, required: true, maxlength: 100, validate: (val: string) =>
        { return val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$") }},
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
BlogSchema.statics.findBlogWithId = async function (id: string): Promise<BlogWithIdType | null> {
    const foundBlog = await BlogModel.findById({_id: id})
    if (!foundBlog) return null
    return {
        id: foundBlog._id.toString(),
        name: foundBlog.name,
        description: foundBlog.description,
        websiteUrl: foundBlog.websiteUrl,
        createdAt: foundBlog.createdAt
    }
}
BlogSchema.statics.findBlogsWithId = async function (dto: FindBlogsWithIdType): Promise<BlogWithIdType[]> {
    return (await BlogModel.find()
        .where('name').regex(RegExp(dto.searchNameTerm, 'i'))
        .skip((dto.pageNumber - 1) * dto.pageSize)
        .limit(dto.pageSize)
        .sort(dto.optionsSort)
        .lean())
        .map(foundBlog => ({
            id: foundBlog._id.toString(),
            name: foundBlog.name,
            description: foundBlog.description,
            websiteUrl: foundBlog.websiteUrl,
            createdAt: foundBlog.createdAt
        }))
}
BlogSchema.statics.findBlogNameById = async function (id: string): Promise<string | null> {
    const foundBlog = await BlogModel.findById({_id: id}).lean()
    return foundBlog ? foundBlog.name : null
}
BlogSchema.statics.findHDBlog = async function (id: string): Promise<HDBlogType | null> {
    return BlogModel.findById(id)
}
export const BlogModel = model<BlogType, BlogModelType>('blogs', BlogSchema)

const UserAccountSchema = new Schema<UserAccountType>({
    login: {type: String, required: true, minlength: 3, maxlength: 30, validate: (val: string) =>
        { return val.match("^[a-zA-Z0-9_-]*$") }},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true, validate: (val: string) =>
        { return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$") }},
    createdAt: {type: String, required: true}
})
const EmailConfirmationSchema = new Schema<EmailConfirmationType>({
    isConfirmed: {type: Boolean, required: true},
    confirmationCode: {type: String},
    expirationDate: {type: Date, required: true}
})
const UserSchema = new Schema<UserDBType>({
    accountData: {type: UserAccountSchema, required: true},
    emailConfirmation: {type: EmailConfirmationSchema, required: true}
})
const PostSchema = new Schema<PostDBType>({
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
const CommentSchema = new Schema<CommentDBType>({
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
})
const SessionSchema = new Schema<SessionDBType>({
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
const AttemptsDataSchema = new Schema<AttemptsDataDBType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})
const PasswordRecoverySchema = new Schema<PasswordRecoveryType>({
    email: {type: String, required: true, validate: (val: string) =>
        { return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$") }},
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})

export const UserModel = model('users', UserSchema)
export const PostModel = model('posts', PostSchema)
export const CommentModel = model('comments', CommentSchema)
export const SessionModel = model('sessions', SessionSchema)
export const AttemptsDataModel = model('attempts_data', AttemptsDataSchema)
export const PasswordRecoveryModel = model('pass_recovery', PasswordRecoverySchema)