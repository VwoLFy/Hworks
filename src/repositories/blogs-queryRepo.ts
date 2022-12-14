import {BlogDBType} from "../types/types";
import {SortDirection} from "../types/enums";
import {BlogModel} from "../types/mongoose-schemas-models";

type BlogOutputModelType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
};
type BlogOutputPageType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogOutputModelType[]
};

export const blogsQueryRepo = {
    async findBlogs(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<BlogOutputPageType> {
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort = {[sortBy]: sortDirection}

        const totalCount = await BlogModel.countDocuments().where('name').regex(RegExp(searchNameTerm, 'i'))
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await BlogModel.find()
            .where('name').regex(RegExp(searchNameTerm, 'i'))
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .lean())
            .map(foundBlog => this.blogWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findBlogById(id: string): Promise<BlogOutputModelType | null> {
        const foundBlog: BlogDBType | null = await BlogModel.findById({_id: id}).lean()
        if (!foundBlog) {
            return null
        } else {
            return this.blogWithReplaceId(foundBlog)
        }
    },
    blogWithReplaceId(object: BlogDBType): BlogOutputModelType {
        return {
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            websiteUrl: object.websiteUrl,
            createdAt: object.createdAt
        }
    }
}