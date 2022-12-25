import {ObjectId} from "mongodb";
import {SortDirection} from "../../main/types/enums";

export class PostClass {
    _id: ObjectId
    createdAt: string

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}

export type PostWithIdType = Omit<PostClass, '_id'> & { id: string }

export type UpdatePostDto = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName?: string
}
export type CreatePostDtoType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type FindPostsDtoType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}
export type FindPostsByBlogIdDtoType = {
    blogId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}