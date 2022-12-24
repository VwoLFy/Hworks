import {LikesRepository} from "../repositories/likes-repository";
import {LikeClass, LikeCommentDto} from "../types/types";

export class LikesService {
    constructor(protected likesRepository: LikesRepository) {}

    async setLikeStatus({commentId, userId, likeStatus}: LikeCommentDto) {
        const isLikeUpdated = await this.likesRepository.updateLikeStatus({commentId, userId, likeStatus})
        if (isLikeUpdated) return

        const like = new LikeClass(commentId, userId, likeStatus)
        await this.likesRepository.setLikeStatus(like)
    }
    async deleteAll() {
        await this.likesRepository.deleteAll()
    }
}