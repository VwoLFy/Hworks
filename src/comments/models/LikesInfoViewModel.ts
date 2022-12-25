import {LikeStatus} from "../../main/types/enums";

export type LikesInfoViewModelType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}