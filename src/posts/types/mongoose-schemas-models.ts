import {HydratedDocument, Model, model, Schema} from "mongoose";
import {FindPostsDTO, PostClass, UpdatePostDTO} from "./types";
import {SortDirection} from "../../main/types/enums";

export interface PostMethodsType {
    updatePost(dto: UpdatePostDTO): void
}
export interface PostModelType extends Model<PostClass, {}, PostMethodsType> {
    isPostExist(_id: string): Promise<boolean>
    findPosts(dto: FindPostsDTO): Promise<PostClass[]>
    countPostsByBlogId(blogId: string): Promise<number>
}
export type PostHDType = HydratedDocument<PostClass, PostMethodsType>

export const PostSchema = new Schema<PostClass, PostModelType, PostMethodsType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
PostSchema.methods.updatePost = function (dto: UpdatePostDTO) {
    this.title = dto.title
    this.shortDescription = dto.shortDescription
    this.content = dto.content
    this.blogId = dto.blogId
    this.blogName = dto.blogName
}
PostSchema.statics.isPostExist = async function (_id: string): Promise<boolean> {
    return !!(await PostModel.findById({_id}))
}
PostSchema.statics.findPosts = async function (dto: FindPostsDTO): Promise<PostClass[]> {
    let {pageNumber, pageSize, sortBy, sortDirection} = dto

    sortBy = sortBy === 'id' ? '_id' : sortBy
    const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

    return PostModel.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(optionsSort)
        .lean()
}
PostSchema.statics.countPostsByBlogId = async function (blogId: string): Promise<number> {
    return PostModel.countDocuments().where('blogId').equals(blogId)
}

export const PostModel = model<PostClass, PostModelType>('posts', PostSchema)