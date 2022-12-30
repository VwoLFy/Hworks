import {LikeStatus} from "../../../main/types/enums";

export type LikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}