import {LikeClass} from "../types/types";
import {LikeModel} from "../types/mongoose-schemas-models";
import {LikeStatus} from "../types/enums";

export class LikesRepository {
    constructor() {
    }
    async setLikeStatus(like: LikeClass): Promise<void> {
        await LikeModel.create(like)
    }

    async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
        const result = await LikeModel.updateOne({commentId, userId}, {$set: {likeStatus, createdAt: (new Date())}})
        return !!result.matchedCount
    }
}