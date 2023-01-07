import {HydratedDocument, model, Schema} from "mongoose";
import {LikeStatus} from "../../main/types/enums";

export class CommentLike {
    addedAt: Date

    constructor(public commentId: string,
                public userId: string,
                public likeStatus: LikeStatus) {
        this.addedAt = new Date()
    }
    updateLikeStatus(likeStatus: LikeStatus): void {
        this.likeStatus = likeStatus
    }
}

export type CommentLikeDocument = HydratedDocument<CommentLike>

const CommentLikeSchema = new Schema<CommentLike>({
    addedAt: {type: Date, required: true},
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
})
CommentLikeSchema.methods = {
    updateLikeStatus: CommentLike.prototype.updateLikeStatus
}

export const CommentLikeModel = model<CommentLikeDocument>('comment_likes', CommentLikeSchema)