import {blogCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeBlogDB} from "../types/types";
import {SortDirection} from "../types/enums";

type TypeBlogOutputModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
};
type TypeBlogOutputPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TypeBlogOutputModel[]
};

export const blogsQueryRepo = {
    async findBlogs(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<TypeBlogOutputPage> {
        let filterFind = {};
        if (searchNameTerm) filterFind = {name: {$regex: searchNameTerm, $options: 'i'}}

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort = {[sortBy]: sortDirection}

        const totalCount = await blogCollection.count(filterFind)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await blogCollection.find(filterFind)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .toArray())
            .map(foundBlog => this.blogWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findBlogById(id: string): Promise<TypeBlogOutputModel | null> {
        const foundBlog: TypeBlogDB | null = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!foundBlog) {
            return null
        } else {
            return this.blogWithReplaceId(foundBlog)
        }
    },
    blogWithReplaceId(object: TypeBlogDB): TypeBlogOutputModel {
        return {
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            websiteUrl: object.websiteUrl,
            createdAt: object.createdAt
        }
    }
}