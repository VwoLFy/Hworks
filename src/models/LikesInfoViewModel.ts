import {LikeStatus} from "../types/enums";

export type LikesInfoViewModelType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}