import {LikeStatus} from "../types/enums";
import {LikesRepository} from "../repositories/likes-repository";
import {LikeClass} from "../types/types";

export class LikesService {
    constructor(protected likesRepository: LikesRepository) {}

    async setLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus) {
        const isLikeUpdated = await this.likesRepository.updateLikeStatus(commentId, userId, likeStatus)
        if (isLikeUpdated) return

        const like = new LikeClass(commentId, userId, likeStatus)
        await this.likesRepository.setLikeStatus(like)
    }
}