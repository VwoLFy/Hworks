import {HydratedDocument, model, Schema} from "mongoose";
import {LikeStatus} from "../../main/types/enums";
import {ObjectId} from "mongodb";

export class LikesInfo {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus

    constructor() {
        this.likesCount = 0
        this.dislikesCount = 0
        this.myStatus = LikeStatus.None
    }
}

export class Comment {
    _id: ObjectId
    createdAt: string

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                public postId: string,
                public likesInfo: LikesInfo) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }

    updateLikesCount(likeStatus: LikeStatus, oldLikeStatus: LikeStatus) {
        if (likeStatus === LikeStatus.Like && oldLikeStatus !== LikeStatus.Like) {
            this.likesInfo.likesCount += 1
        } else if (likeStatus === LikeStatus.Dislike && oldLikeStatus !== LikeStatus.Dislike) {
            this.likesInfo.dislikesCount += 1
        }
        if (likeStatus !== LikeStatus.Like && oldLikeStatus === LikeStatus.Like) {
            this.likesInfo.likesCount -= 1
        } else if (likeStatus !== LikeStatus.Dislike && oldLikeStatus === LikeStatus.Dislike) {
            this.likesInfo.dislikesCount -= 1
        }
    }
    updateComment(content: string) {
        this.content = content
    }
}

export type CommentDocument = HydratedDocument<Comment>

const LikeInfoSchema = new Schema<LikesInfo>({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: {type: String, required: true}
}, {_id: false})
const CommentSchema = new Schema<Comment>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {type: LikeInfoSchema, required: true}
})
CommentSchema.methods = {
    updateLikesCount: Comment.prototype.updateLikesCount,
    updateComment: Comment.prototype.updateComment
}

export const CommentModel = model<CommentDocument>('comments', CommentSchema)