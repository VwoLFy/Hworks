import {HydratedDocument, model, Schema} from "mongoose";
import {LikeStatus} from "../../main/types/enums";
import {ObjectId} from "mongodb";
import {Like, LikeDocument, LikeModel} from "./like.schema";

export class Comment {
    public _id: ObjectId
    public createdAt: string
    public likesInfo: {
        likesCount: number
        dislikesCount: number
    }

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                public postId: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0
        }
    }

    async setLikeStatus(userId: string, likeStatus: LikeStatus): Promise<LikeDocument> {
        let oldLikeStatus: LikeStatus
        let like: LikeDocument

        const oldLike = await LikeModel.findOne({commentId: this._id, userId})

        if (oldLike) {
            oldLikeStatus = oldLike.likeStatus
            like = oldLike
            like.updateLikeStatus(likeStatus)
        } else {
            oldLikeStatus = LikeStatus.None
            like = this.newLike(userId, likeStatus)
        }

        this.updateLikesCount(likeStatus, oldLikeStatus)

        return like
    }

    newLike(userId: string, likeStatus: LikeStatus): LikeDocument {
        const newLike = new Like(this._id.toString(), userId, likeStatus)
        return new LikeModel(newLike)
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

const CommentSchema = new Schema<Comment>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
    }
})
CommentSchema.methods = {
    setLikeStatus: Comment.prototype.setLikeStatus,
    newLike: Comment.prototype.newLike,
    updateLikesCount: Comment.prototype.updateLikesCount,
    updateComment: Comment.prototype.updateComment
}

export const CommentModel = model<CommentDocument>('comments', CommentSchema)