import {LikeStatus} from "../../../main/types/enums";

export type CommentLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}