import {LikesInfoViewModelType} from "./LikesInfoViewModel";

export type CommentViewModelType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: LikesInfoViewModelType
}