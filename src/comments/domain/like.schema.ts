import {HydratedDocument, model, Schema} from "mongoose";
import {LikeStatus} from "../../main/types/enums";

export class Like {
    createdAt: Date

    constructor(public commentId: string,
                public userId: string,
                public likeStatus: LikeStatus) {
        this.createdAt = new Date()
    }
    updateLikeStatus(likeStatus: LikeStatus): void {
        this.likeStatus = likeStatus
    }
}

export type LikeDocument = HydratedDocument<Like>
const LikeSchema = new Schema<Like>({
    createdAt: {type: Date, required: true},
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
})
LikeSchema.methods = {
    updateLikeStatus: Like.prototype.updateLikeStatus
}

export const LikeModel = model<LikeDocument>('likes', LikeSchema)