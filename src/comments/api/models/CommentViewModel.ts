import {CommentLikesInfoViewModel} from "./CommentLikesInfoViewModel";

export type CommentViewModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: CommentLikesInfoViewModel
}