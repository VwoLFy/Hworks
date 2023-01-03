import {Post, PostModel} from "../domain/post.schema";
import {injectable} from "inversify";
import {FindPostsQueryModel} from "../api/models/FindPostsQueryModel";
import {PostViewModel} from "../api/models/PostViewModel";
import {PostsViewModelPage} from "../api/models/PostsViewModelPage";


@injectable()
export class PostsQueryRepo{
    async findPosts(dto: FindPostsQueryModel): Promise<PostsViewModelPage> {
        let {pageNumber, pageSize} = dto;
        const totalCount = await PostModel.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostViewModel[] = (await PostModel.findPosts(dto)).map(p => this.postWithReplaceId(p))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findPostById(_id: string): Promise<PostViewModel | null> {
        const foundPost = await PostModel.findById({_id}).lean()
        if (!foundPost) return null

        return this.postWithReplaceId(foundPost)
    }
    async findPostsByBlogId(blogId: string, dto: FindPostsQueryModel): Promise<PostsViewModelPage | null> {
        let {pageNumber, pageSize} = dto

        const totalCount = await PostModel.countPostsByBlogId(blogId)
        if (totalCount == 0) return null

        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostViewModel[] = (await PostModel.findPosts(dto)).map(p => this.postWithReplaceId(p))
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    postWithReplaceId (object: Post ): PostViewModel {
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