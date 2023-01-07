import {LikeStatus} from "../../../main/types/enums";

export type LikePostDto = {
    postId: string
    userId: string
    likeStatus: LikeStatus
}