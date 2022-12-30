import {BlogClass, FindBlogsDtoType} from "../types/types";
import {BlogModel} from "../types/mongoose-schemas-models";
import {injectable} from "inversify";

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

@injectable()
export class BlogsQueryRepo {
    async findBlogs(dto: FindBlogsDtoType): Promise<BlogOutputPageType> {
        const {searchNameTerm, pageNumber, pageSize} = dto
        const totalCount = await BlogModel.countBlogs(searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: BlogOutputModelType[] = (await BlogModel.findBlogs(dto)).map(b => this.blogWithReplaceId(b))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findBlogById(_id: string): Promise<BlogOutputModelType | null> {
        const foundBlog = await BlogModel.findById({_id}).lean()
        if (!foundBlog) return null

        return this.blogWithReplaceId(foundBlog)
    }
    blogWithReplaceId(object: BlogClass): BlogOutputModelType {
        return {
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            websiteUrl: object.websiteUrl,
            createdAt: object.createdAt
        }
    }
}