import {HydratedDocument, Model, model, Schema} from "mongoose";
import {FindPostsByBlogIdDtoType, FindPostsDtoType, PostClass, PostWithIdType, UpdatePostDto} from "./types";
import {SortDirection} from "../../main/types/enums";
import {ObjectId} from "mongodb";

export interface PostMethodsType {
    updatePost(dto: UpdatePostDto): void
}
export interface PostModelType extends Model<PostClass, {}, PostMethodsType> {
    findHDPost(id: string): Promise<HDPostType | null>

    isPostExist(id: string): Promise<boolean>

    findPostsWithId(dto: FindPostsDtoType): Promise<PostWithIdType[]>

    findPostWithId(_id: ObjectId): Promise<PostWithIdType | null>

    findPostsByBlogId(dto: FindPostsByBlogIdDtoType): Promise<PostWithIdType[] | null>
}
export type HDPostType = HydratedDocument<PostClass, PostMethodsType>

export const PostSchema = new Schema<PostClass, PostModelType, PostMethodsType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
PostSchema.methods.updatePost = function (dto: UpdatePostDto) {
    this.title = dto.title
    this.shortDescription = dto.shortDescription
    this.content = dto.content
    this.blogId = dto.blogId
    this.blogName = dto.blogName
}
PostSchema.statics.findHDPost = async function (id: string): Promise<HDPostType | null> {
    return PostModel.findById(id)
}
PostSchema.statics.isPostExist = async function (id: string): Promise<boolean> {
    return !!(await PostModel.findById({_id: id}))
}
PostSchema.statics.findPostsWithId = async function (dto: FindPostsDtoType): Promise<PostWithIdType[]> {
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
PostSchema.statics.findPostWithId = async function (_id: ObjectId): Promise<PostWithIdType | null> {
    const foundPost = await PostModel.findById({_id})
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
PostSchema.statics.findPostsByBlogId = async function (dto: FindPostsByBlogIdDtoType): Promise<PostWithIdType[] | null> {
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

export const PostModel = model<PostClass, PostModelType>('posts', PostSchema)