import {LikeStatus} from "../../../main/types/enums";

export type LikeCommentDto = {
    commentId: string
    userId: string
    likeStatus: LikeStatus
}