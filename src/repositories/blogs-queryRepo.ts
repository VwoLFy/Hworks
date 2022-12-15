import {BlogModel} from "../types/mongoose-schemas-models";
import {FindBlogsType} from "../types/types";

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
    async findBlogs(dto: FindBlogsType): Promise<BlogOutputPageType> {
        let {searchNameTerm, pageNumber, pageSize, sortBy, sortDirection} = dto
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const optionsSort = {[sortBy]: sortDirection}

        const totalCount = await BlogModel.countDocuments().where('name').regex(RegExp(searchNameTerm, 'i'))
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items: BlogOutputModelType[] = await BlogModel.findBlogsWithId({
            searchNameTerm,
            pageNumber,
            pageSize,
            optionsSort
        })
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findBlogById(id: string): Promise<BlogOutputModelType | null> {
        const foundBlog: BlogOutputModelType | null = await BlogModel.findBlogWithId(id)
        return foundBlog ? foundBlog : null
    }
}