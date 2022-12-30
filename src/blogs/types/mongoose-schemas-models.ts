import {HydratedDocument, Model, model, Schema} from "mongoose";
import {BlogClass, FindBlogsDtoType, UpdateBlogDtoType} from "./types";
import {SortDirection} from "../../main/types/enums";

interface IBlogMethods {
    updateBlog(dto: UpdateBlogDtoType): void
}
interface BlogModelType extends Model<BlogClass, {}, IBlogMethods> {
    findBlogs(dto: FindBlogsDtoType): Promise<BlogClass[]>
    findBlogNameById(id: string): Promise<string | null>
    countBlogs(searchNameTerm: string): Promise<number>
}
export type BlogHDType = HydratedDocument<BlogClass, IBlogMethods>

const BlogSchema = new Schema<BlogClass, BlogModelType, IBlogMethods>({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {
        type: String, required: true, maxlength: 100,
        validate: (val: string) => val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
    },
    createdAt: {type: String, required: true}
})
BlogSchema.methods.updateBlog = function (dto: UpdateBlogDtoType) {
    this.name = dto.name
    this.description = dto.description
    this.websiteUrl = dto.websiteUrl
}
BlogSchema.statics.findBlogs = async function (dto: FindBlogsDtoType): Promise<BlogClass[]> {
    let {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = dto

    sortBy = sortBy === 'id' ? '_id' : sortBy
    const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

    return BlogModel.find()
        .where('name').regex(RegExp(searchNameTerm, 'i'))
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort(optionsSort)
        .lean()
}
BlogSchema.statics.findBlogNameById = async function (id: string): Promise<string | null> {
    const foundBlog = await BlogModel.findById({_id: id}).lean()
    return foundBlog ? foundBlog.name : null
}
BlogSchema.statics.countBlogs = async function (searchNameTerm: string): Promise<number> {
    return BlogModel.countDocuments().where('name').regex(new RegExp(searchNameTerm, 'i'))
}
export const BlogModel = model<BlogClass, BlogModelType>('blogs', BlogSchema)