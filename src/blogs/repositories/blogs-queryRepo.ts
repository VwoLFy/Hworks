import {ObjectId} from "mongodb";
import {FindBlogsDtoType} from "../types/types";
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
        const totalCount = await BlogModel.countDocuments().where('name').regex(RegExp(searchNameTerm, 'i'))
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: BlogOutputModelType[] = await BlogModel.findBlogsWithId(dto)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findBlogById(_id: string): Promise<BlogOutputModelType | null> {
        const foundBlog: BlogOutputModelType | null = await BlogModel.findBlogWithId(new ObjectId(_id))
        return foundBlog ? foundBlog : null
    }
}