import {ObjectId} from "mongodb";
import {SortDirection} from "../../main/types/enums";

export class BlogClass {
    _id: ObjectId
    createdAt: string

    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this._id = new ObjectId()
        this.createdAt = new Date().toISOString()
    }
}

export type UpdateBlogDTO = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogDTO = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsDTO = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}