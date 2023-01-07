import {LikeStatus} from "../../main/types/enums";
import {HydratedDocument, model, Schema} from "mongoose";

export class PostLike {
    public addedAt: string

    constructor(public postId: string,
                public userId: string,
                public login: string,
                public likeStatus: LikeStatus) {
        this.addedAt = new Date().toISOString()
    }

    updateLikeStatus(likeStatus: LikeStatus) {
        this.likeStatus = likeStatus
    }
}
export type PostLikeDocument = HydratedDocument<PostLike>

const PostLikeSchema = new Schema<PostLike>({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true},
    addedAt: {type: String, required: true},
    likeStatus: {type: String, required: true},
})
PostLikeSchema.methods = {
    updateLikeStatus: PostLike.prototype.updateLikeStatus
}

export const PostLikeModel = model<PostLikeDocument>('post_likes', PostLikeSchema)
