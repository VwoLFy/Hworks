import {HydratedDocument, Model, model, Schema} from "mongoose";
import {UpdateBlogDto} from "../application/dto/UpdateBlogDto";
import {SortDirection} from "../../main/types/enums";
import {ObjectId} from "mongodb";
import {FindBlogsQueryModel} from "../api/models/FindBlogsQueryModel";

export class Blog {
    _id: ObjectId
    createdAt: string

    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }

    updateBlog(dto: UpdateBlogDto) {
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
    }
}

interface IBlogModel extends Model<Blog> {
    findBlogs(dto: FindBlogsQueryModel): Promise<Blog[]>
    findBlogNameById(id: string): Promise<string | null>
    countBlogs(searchNameTerm: string): Promise<number>
}
export type BlogDocument = HydratedDocument<Blog>

const BlogSchema = new Schema<Blog, IBlogModel>({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {
        type: String, required: true, maxlength: 100,
        validate: (val: string) => val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
    },
    createdAt: {type: String, required: true}
})
BlogSchema.methods = {
    updateBlog: Blog.prototype.updateBlog
}
BlogSchema.statics = {
    async findBlogs(dto: FindBlogsQueryModel): Promise<Blog[]> {
        let {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = dto

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

        return BlogModel.find()
            .where('name').regex(new RegExp(searchNameTerm, 'i'))
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .lean()
    },
    async findBlogNameById(id: string): Promise<string | null> {
        const foundBlog = await BlogModel.findById({_id: id}).lean()
        return foundBlog ? foundBlog.name : null
    },
    async countBlogs(searchNameTerm: string): Promise<number> {
        return BlogModel.countDocuments().where('name').regex(new RegExp(searchNameTerm, 'i'))
    }
}

export const BlogModel = model<BlogDocument, IBlogModel>('blogs', BlogSchema)