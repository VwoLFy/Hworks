import {HydratedDocument, Model, model, Schema} from "mongoose";
import {CommentClass, LikesInfoClass} from "./types";
import {LikeStatus} from "../../main/types/enums";

interface ICommentMethods {
    updateLikesCount(likeStatus: LikeStatus, oldLikeStatus: LikeStatus): void
    updateComment(content: string): void
}
type CommentModelType = Model<CommentClass, {}, ICommentMethods>
export type CommentHDType = HydratedDocument<CommentClass, ICommentMethods>

const LikeInfoSchema = new Schema<LikesInfoClass>({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: {type: String, required: true}
}, {_id: false})
const CommentSchema = new Schema<CommentClass, CommentModelType, ICommentMethods>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {type: LikeInfoSchema, required: true}
})
CommentSchema.methods.updateLikesCount = function (likeStatus: LikeStatus, oldLikeStatus: LikeStatus): void {
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
CommentSchema.methods.updateComment = function (content: string): void {
    this.content = content
}
export const CommentModel = model<CommentClass, CommentModelType>('comments', CommentSchema)