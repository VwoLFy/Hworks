import {Blog, BlogModel} from "../domain/blog.schema";
import {injectable} from "inversify";
import {FindBlogsQueryModel} from "../api/models/FindBlogsQueryModel";
import {BlogViewModel} from "../api/models/BlogViewModel";
import {BlogsViewModelPage} from "../api/models/BlogsViewModelPage";

@injectable()
export class BlogsQueryRepo {
    async findBlogs(dto: FindBlogsQueryModel): Promise<BlogsViewModelPage> {
        const {searchNameTerm, pageNumber, pageSize} = dto
        const totalCount = await BlogModel.countBlogs(searchNameTerm)
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: BlogViewModel[] = (await BlogModel.findBlogs(dto)).map(b => this.blogWithReplaceId(b))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findBlogById(_id: string): Promise<BlogViewModel | null> {
        const foundBlog = await BlogModel.findById({_id}).lean()
        if (!foundBlog) return null

        return this.blogWithReplaceId(foundBlog)
    }
    blogWithReplaceId(object: Blog): BlogViewModel {
        return {
            id: object._id.toString(),
            name: object.name,
            description: object.description,
            websiteUrl: object.websiteUrl,
            createdAt: object.createdAt
        }
    }
}