import {LikeStatus, SortDirection} from "../../main/types/enums";
import {ObjectId} from "mongodb";

export class LikeClass {
    createdAt: Date

    constructor(public commentId: string,
                public userId: string,
                public likeStatus: LikeStatus) {
        this.createdAt = new Date()
    }
}
export class LikesInfoClass {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus

    constructor() {
        this.likesCount = 0
        this.dislikesCount = 0
        this.myStatus = LikeStatus.None
    }
}
export class CommentClass {
    _id: ObjectId
    createdAt: string

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                public postId: string,
                public likesInfo: LikesInfoClass) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}

export type LikeCommentDtoType = {
    commentId: string
    userId: string
    likeStatus: LikeStatus
}
export type CreateCommentDtoType = {
    postId: string
    content: string
    userId: string
}
export type UpdateCommentDtoType = {
    commentId: string
    content: string
    userId: string
}
export type FindCommentsDtoType = {
    postId: string
    page: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    userId: string | null
}