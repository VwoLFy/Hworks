import {model, Schema} from "mongoose";
import {
    AttemptsDataMethodsType, AttemptsDataModelType, AttemptsDataType,
    BlogMethodsType,
    BlogModelType,
    BlogType,
    BlogWithIdType, CommentClass,
    CreateBlogTypeM, CreatePostTypeM,
    EmailConfirmationType, FindBlogsType, FindPostsByBlogIdType,
    FindPostsType, HDBlogType, HDPostType,
    PasswordRecoveryType,
    PostMethodsType, PostModelType, PostType, PostWithIdType, SessionClass,
    UpdateBlogTypeM, UpdatePostTypeM,
    UserAccountType,
    UserDBType
} from "./types";
import {SortDirection} from "./enums";
import add from "date-fns/add";

const BlogSchema = new Schema<BlogType, BlogModelType, BlogMethodsType>({
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {
        type: String, required: true, maxlength: 100, validate: (val: string) => {
            return val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
        }
    },
    createdAt: {type: String, required: true}
})
BlogSchema.methods.updateBlog = function (dto: UpdateBlogTypeM) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
}
BlogSchema.statics.createBlog = function (dto: CreateBlogTypeM): Promise<HDBlogType> {
    return BlogModel.create({
        ...dto,
        createdAt: new Date().toISOString()
    })
}
BlogSchema.statics.findBlogWithId = async function (id: string): Promise<BlogWithIdType | null> {
    const foundBlog = await BlogModel.findById({_id: id})
    if (!foundBlog) return null
    return {
        id: foundBlog.id,
        name: foundBlog.name,
        description: foundBlog.description,
        websiteUrl: foundBlog.websiteUrl,
        createdAt: foundBlog.createdAt
    }
}
BlogSchema.statics.findBlogsWithId = async function (dto: FindBlogsType): Promise<BlogWithIdType[]> {
    let {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = dto

    sortBy = sortBy === 'id' ? '_id' : sortBy
    const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

    return (await BlogModel.find()
        .where('name').regex(RegExp(searchNameTerm, 'i'))
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(optionsSort))
        .map(foundBlog => ({
            id: foundBlog.id,
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

const PostSchema = new Schema<PostType, PostModelType, PostMethodsType>({
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
PostSchema.methods.updatePost = function (dto: UpdatePostTypeM) {
    this.title = dto.title
    this.shortDescription = dto.shortDescription
    this.content = dto.content
    this.blogId = dto.blogId
    this.blogName = dto.blogName
}
PostSchema.statics.createPost = function (dto: CreatePostTypeM): Promise<HDPostType> {
    return PostModel.create({
        ...dto,
        createdAt: new Date().toISOString()
    })
}
PostSchema.statics.findHDPost = async function (id: string): Promise<HDPostType | null> {
    return PostModel.findById(id)
}
PostSchema.statics.isPostExist = async function (id: string): Promise<boolean> {
    return !!(await PostModel.findById({_id: id}))
}
PostSchema.statics.findPostsWithId = async function (dto: FindPostsType): Promise<PostWithIdType[]> {
    let {pageNumber, pageSize, sortBy, sortDirection} = dto

    sortBy = sortBy === 'id' ? '_id' : sortBy
    const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

    return (await PostModel.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(optionsSort))
        .map(foundPost => ({
            id: foundPost.id,
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt
        }))
}
PostSchema.statics.findPostWithId = async function (id: string): Promise<PostWithIdType | null> {
    const foundPost = await PostModel.findById({_id: id})
    if (!foundPost) return null
    return {
        id: foundPost.id,
        title: foundPost.title,
        shortDescription: foundPost.shortDescription,
        content: foundPost.content,
        blogId: foundPost.blogId,
        blogName: foundPost.blogName,
        createdAt: foundPost.createdAt
    }
}
PostSchema.statics.findPostsByBlogId = async function (dto: FindPostsByBlogIdType): Promise<PostWithIdType[] | null> {
    let {blogId, pageNumber, pageSize, sortBy, sortDirection} = dto

    sortBy = sortBy === 'id' ? '_id' : sortBy
    const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

    return (await PostModel.find()
        .where('blogId').equals(blogId)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(optionsSort))
        .map(foundPost => ({
            id: foundPost.id,
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt
        }))
}
export const PostModel = model<PostType, PostModelType>('posts', PostSchema)

const AttemptsDataSchema = new Schema<AttemptsDataType, AttemptsDataModelType, AttemptsDataMethodsType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true}
})
AttemptsDataSchema.statics.findAttempts = async function (ip: string, url: string): Promise<number> {
    const fromDate = +add(new Date(), {seconds: -10})
    let query = AttemptsDataModel.countDocuments()
        .where('ip').equals(ip)
        .where('url').equals(url)
        .where('date').gte(fromDate)
    return query.exec()
}
AttemptsDataSchema.statics.addAttemptToList = async function (ip: string, url: string) {
    await AttemptsDataModel.create(
        {
            ip,
            url,
            date: new Date()
        }
    )
}
export const AttemptsDataModel = model<AttemptsDataType, AttemptsDataModelType>('attempts_data', AttemptsDataSchema)


const UserAccountSchema = new Schema<UserAccountType>({
    login: {
        type: String, required: true, minlength: 3, maxlength: 30, validate: (val: string) => {
            return val.match("^[a-zA-Z0-9_-]*$")
        }
    },
    passwordHash: {type: String, required: true},
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
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
const CommentSchema = new Schema<CommentClass>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
})
const SessionSchema = new Schema<SessionClass>({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    exp: {type: Number, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    iat: {type: Number, required: true},
    deviceId: {type: String, required: true},
})
const PasswordRecoverySchema = new Schema<PasswordRecoveryType>({
    email: {
        type: String, required: true, validate: (val: string) => {
            return val.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        }
    },
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})

export const UserModel = model('users', UserSchema)
export const CommentModel = model('comments', CommentSchema)
export const SessionModel = model('sessions', SessionSchema)
export const PasswordRecoveryModel = model('pass_recovery', PasswordRecoverySchema)