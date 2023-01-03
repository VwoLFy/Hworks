import {HydratedDocument, Model, model, Schema} from "mongoose";
import {UpdatePostDto} from "../application/dto/UpdatePostDto";
import {SortDirection} from "../../main/types/enums";
import {ObjectId} from "mongodb";
import {FindPostsQueryModel} from "../api/models/FindPostsQueryModel";

export class Post {
    _id: ObjectId
    createdAt: string

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }

    updatePost(dto: UpdatePostDto, blogName: string) {
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = blogName
    }
}

interface IPostModel extends Model<Post> {
    isPostExist(_id: string): Promise<boolean>
    findPosts(dto: FindPostsQueryModel): Promise<Post[]>
    countPostsByBlogId(blogId: string): Promise<number>
}
export type PostDocument = HydratedDocument<Post>

const PostSchema = new Schema<Post, IPostModel>({
    _id: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true, maxlength: 30},
    shortDescription: {type: String, required: true, maxlength: 100},
    content: {type: String, required: true, maxlength: 1000},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true, maxlength: 15},
    createdAt: {type: String, required: true}
})
PostSchema.methods = {
    updatePost: Post.prototype.updatePost
}
PostSchema.statics = {
    async isPostExist(_id: string): Promise<boolean> {
        return !!(await PostModel.findById({_id}))
    },
    async findPosts(dto: FindPostsQueryModel): Promise<Post[]> {
        let {pageNumber, pageSize, sortBy, sortDirection} = dto

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

        return PostModel.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .lean()
    },
    async countPostsByBlogId(blogId: string): Promise<number> {
        return PostModel.countDocuments().where('blogId').equals(blogId)
    }
}

export const PostModel = model<PostDocument, IPostModel>('posts', PostSchema)