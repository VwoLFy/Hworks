import {HydratedDocument, model, Model, Schema} from "mongoose";
import {LikeClass} from "./types";
import {LikeStatus} from "../../main/types/enums";

interface ILikeMethods {
    updateLikeStatus(likeStatus: LikeStatus): void
}

type LikeModelType = Model<LikeClass, {}, ILikeMethods>
export type LikeHDType = HydratedDocument<LikeClass, ILikeMethods>
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