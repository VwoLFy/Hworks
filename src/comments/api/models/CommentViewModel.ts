import {LikesInfoViewModel} from "./LikesInfoViewModel";

export type CommentViewModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: LikesInfoViewModel
}