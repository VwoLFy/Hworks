import {LikeStatus} from "../../../main/types/enums";
import {PostLikeDetailsViewModel} from "./PostLikeDetailsViewModel";

export type PostLikesInfoViewModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: PostLikeDetailsViewModel[]
}