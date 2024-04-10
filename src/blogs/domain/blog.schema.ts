import {HydratedDocument, model, Schema} from "mongoose";
import {UpdateBlogDto} from "../application/dto/UpdateBlogDto";
import {ObjectId} from "mongodb";

export class Blog {
    _id: ObjectId
    createdAt: string
    isMembership: boolean

    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
        this.isMembership = false
    }

    updateBlog(dto: UpdateBlogDto) {
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
    }
    static createBlogDocument(name: string, description: string, websiteUrl: string): BlogDocument {
        const blog = new Blog(name, description, websiteUrl)
        return new BlogModel(blog)
    }
}

export type BlogDocument = HydratedDocument<Blog>

const BlogSchema = new Schema<Blog>({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true, maxlength: 15},
    description: {type: String, required: true, maxlength: 500},
    websiteUrl: {
        type: String, required: true, maxlength: 100,
        validate: (val: string) => val.match("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
    },
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})
BlogSchema.loadClass(Blog)

export const BlogModel = model('blogs', BlogSchema)