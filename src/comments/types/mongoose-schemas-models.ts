import {model, Schema} from "mongoose";
import {CommentClass, LikeClass, LikesInfoClass} from "./types";

const LikeSchema = new Schema<LikeClass>({
    createdAt: {type: Date, required: true},
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    likeStatus: {type: String, required: true},
})
export const LikeModel = model('likes', LikeSchema)

const LikeInfoSchema = new Schema<LikesInfoClass>({
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: {type: String, required: true}
}, {_id: false})
const CommentSchema = new Schema<CommentClass>({
    _id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true, minlength: 20, maxlength: 300},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true, minlength: 3, maxlength: 30},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {type: LikeInfoSchema, required: true}
})
export const CommentModel = model('comments', CommentSchema)