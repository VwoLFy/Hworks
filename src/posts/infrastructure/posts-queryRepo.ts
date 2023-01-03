import {FindPostsByBlogIdDTO, FindPostsDTO, PostClass} from "../domain/types";
import {PostModel} from "../domain/post.schema";
import {injectable} from "inversify";

type PostOutputModelType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
type PostOutputPageType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostOutputModelType[]
};

@injectable()
export class PostsQueryRepo{
    async findPosts(dto: FindPostsDTO): Promise<PostOutputPageType> {
        let {pageNumber, pageSize} = dto;
        const totalCount = await PostModel.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostOutputModelType[] = (await PostModel.findPosts(dto)).map(p => this.postWithReplaceId(p))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findPostById(_id: string): Promise<PostOutputModelType | null> {
        const foundPost = await PostModel.findById({_id}).lean()
        if (!foundPost) return null

        return this.postWithReplaceId(foundPost)
    }
    async findPostsByBlogId(dto: FindPostsByBlogIdDTO): Promise<PostOutputPageType | null> {
        let {blogId, pageNumber, pageSize} = dto

        const totalCount = await PostModel.countPostsByBlogId(blogId)
        if (totalCount == 0) return null

        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostOutputModelType[] = (await PostModel.findPosts(dto)).map(p => this.postWithReplaceId(p))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    postWithReplaceId (object: PostClass ): PostOutputModelType {
        return {
            id: object._id.toString(),
            title: object.title,
            shortDescription: object.shortDescription,
            content: object.content,
            blogId: object.blogId,
            blogName: object.blogName,
            createdAt: object.createdAt
        }
    }
}