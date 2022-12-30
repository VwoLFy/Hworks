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

export type UpdateBlogDtoType = {
    name: string
    description: string
    websiteUrl: string
}
export type CreateBlogDtoType = {
    name: string
    description: string
    websiteUrl: string
}
export type FindBlogsDtoType = {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
}