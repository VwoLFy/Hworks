import {HydratedDocument, Model, model, Schema} from "mongoose";
import {BlogClass, BlogWithIdType, FindBlogsDtoType, UpdateBlogDtoType} from "./types";
import {ObjectId} from "mongodb";
import {SortDirection} from "../../main/types/enums";

export interface BlogMethodsType {
    updateBlog(dto: UpdateBlogDtoType): void
}
export interface BlogModelType extends Model<BlogClass, {}, BlogMethodsType> {
    findBlogWithId(_id: ObjectId): Promise<BlogWithIdType | null>

    findBlogsWithId(dto: FindBlogsDtoType): Promise<BlogWithIdType[]>

    findBlogNameById(id: string): Promise<string | null>

    findHDBlog(id: string): Promise<HDBlogType | null>
}
export type HDBlogType = HydratedDocument<BlogClass, BlogMethodsType>

export const BlogSchema = new Schema<BlogClass, BlogModelType, BlogMethodsType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {
        type: String, required: true, maxlength: 100, validate: (val: string) => {
            return val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
        }
    },
    createdAt: {type: String, required: true}
})
BlogSchema.methods.updateBlog = function (dto: UpdateBlogDtoType) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
}
BlogSchema.statics.findBlogWithId = async function (_id: ObjectId): Promise<BlogWithIdType | null> {
    const foundBlog = await BlogModel.findById({_id})
    if (!foundBlog) return null
    return {
        id: foundBlog.id,
        name: foundBlog.name,
        description: foundBlog.description,
        websiteUrl: foundBlog.websiteUrl,
        createdAt: foundBlog.createdAt
    }
}
BlogSchema.statics.findBlogsWithId = async function (dto: FindBlogsDtoType): Promise<BlogWithIdType[]> {
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

export const BlogModel = model<BlogClass, BlogModelType>('blogs', BlogSchema)