import {PostLikesInfoViewModel} from "./PostLikesInfoViewModel";

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    //extendedLikesInfo: PostLikesInfoViewModel
}