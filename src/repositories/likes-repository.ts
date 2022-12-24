import {LikeClass, LikeCommentDto} from "../types/types";
import {LikeModel} from "../types/mongoose-schemas-models";
import {LikeStatus} from "../types/enums";

export class LikesRepository {
    constructor() {
    }
    async setLikeStatus(like: LikeClass): Promise<void> {
        await LikeModel.create(like)
    }

    async updateLikeStatus({commentId, userId, likeStatus}: LikeCommentDto): Promise<boolean> {
        if (likeStatus === LikeStatus.None) {
            await LikeModel.deleteOne({commentId, userId})
            return true
        }
        const result = await LikeModel.updateOne({commentId, userId}, {$set: {likeStatus, createdAt: (new Date())}})
        return !!result.matchedCount
    }
    async deleteAll() {
        await LikeModel.deleteMany()
    }
}