import {HydratedDocument, model, Model, Schema} from "mongoose";
import {LikeStatus} from "../../main/types/enums";

interface ILikeMethods {
    updateLikeStatus(likeStatus: LikeStatus): void
}

export class LikeClass {
    createdAt: Date

    constructor(public commentId: string,
                public userId: string,
                public likeStatus: LikeStatus) {
        this.createdAt = new Date()
    }
}

type LikeModelType = Model<LikeClass, {}, ILikeMethods>
export type LikeDocument = HydratedDocument<LikeClass, ILikeMethods>
export const LikeSchema = new Schema<LikeClass, LikeModelType, ILikeMethods>({
    createdAt: {type: Date, required: true},
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
})
LikeSchema.methods.updateLikeStatus = function (likeStatus: LikeStatus): void {
    this.likeStatus = likeStatus
}
export const LikeModel = model<LikeClass, LikeModelType>('likes', LikeSchema)