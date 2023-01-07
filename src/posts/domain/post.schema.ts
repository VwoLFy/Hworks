import {HydratedDocument, Model, model, Schema} from "mongoose";
import {UpdatePostDto} from "../application/dto/UpdatePostDto";
import {LikeStatus, SortDirection} from "../../main/types/enums";
import {ObjectId} from "mongodb";
import {FindPostsQueryModel} from "../api/models/FindPostsQueryModel";
import {PostLike, PostLikeDocument, PostLikeModel} from "./postLike.schema";

export class Post {
    public _id: ObjectId
    public createdAt: string
    public extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
    }

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
        this.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0
        }
    }

    updatePost(dto: UpdatePostDto, blogName: string) {
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = blogName
    }
    setLikeStatus(oldLike: PostLikeDocument | null, userId: string, userLogin: string, likeStatus: LikeStatus) {
        let oldLikeStatus: LikeStatus
        let like: PostLikeDocument

        if (oldLike) {
            oldLikeStatus = oldLike.likeStatus
            like = oldLike
            like.updateLikeStatus(likeStatus)
        } else {
            oldLikeStatus = LikeStatus.None
            like = this.newLike(userId, userLogin, likeStatus)
        }

        this.updateLikesCount(likeStatus, oldLikeStatus)
        return like
    }
    newLike(userId: string, userLogin: string, likeStatus: LikeStatus): PostLikeDocument {
        const newLike = new PostLike(this._id.toString(), userId, userLogin, likeStatus)
        return new PostLikeModel(newLike)
    }
    updateLikesCount(likeStatus: LikeStatus, oldLikeStatus: LikeStatus) {
        if (likeStatus === LikeStatus.Like && oldLikeStatus !== LikeStatus.Like) {
            this.extendedLikesInfo.likesCount += 1
        } else if (likeStatus === LikeStatus.Dislike && oldLikeStatus !== LikeStatus.Dislike) {
            this.extendedLikesInfo.dislikesCount += 1
        }
        if (likeStatus !== LikeStatus.Like && oldLikeStatus === LikeStatus.Like) {
            this.extendedLikesInfo.likesCount -= 1
        } else if (likeStatus !== LikeStatus.Dislike && oldLikeStatus === LikeStatus.Dislike) {
            this.extendedLikesInfo.dislikesCount -= 1
        }
    }
}

interface IPostModel extends Model<Post> {
    findPosts(dto: FindPostsQueryModel): Promise<Post[]>
    findPostsByBlogId(blogId: string, dto: FindPostsQueryModel): Promise<Post[]>
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
    createdAt: {type: String, required: true},
    extendedLikesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true}
    }
})
PostSchema.methods = {
    updatePost: Post.prototype.updatePost,
    setLikeStatus: Post.prototype.setLikeStatus,
    newLike: Post.prototype.newLike,
    updateLikesCount: Post.prototype.updateLikesCount
}
PostSchema.statics = {
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
    async findPostsByBlogId(blogId: string, dto: FindPostsQueryModel): Promise<Post[]> {
        let {pageNumber, pageSize, sortBy, sortDirection} = dto

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort: { [key: string]: SortDirection } = {[sortBy]: sortDirection}

        return PostModel.find()
            .where('blogId').equals(blogId)
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