import {ObjectId} from "mongodb";
import {FindPostsByBlogIdDtoType, FindPostsDtoType} from "../types/types";
import {PostModel} from "../types/mongoose-schemas-models";
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
    async findPosts(dto: FindPostsDtoType): Promise<PostOutputPageType> {
        let {pageNumber, pageSize} = dto;
        const totalCount = await PostModel.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostOutputModelType[] = await PostModel.findPostsWithId(dto)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findPostById(_id: string): Promise<PostOutputModelType | null> {
        const foundPost: PostOutputModelType | null = await PostModel.findPostWithId(new ObjectId(_id))
        return foundPost ? foundPost : null
    }
    async findPostsByBlogId(dto: FindPostsByBlogIdDtoType): Promise<PostOutputPageType | null> {
        let {blogId, pageNumber, pageSize} = dto

        const totalCount = await PostModel.countDocuments().where('blogId').equals(blogId)
        if (totalCount == 0) return null

        const pagesCount = Math.ceil(totalCount / pageSize)

        const items: PostOutputModelType[] = await PostModel.findPostsWithId(dto)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
}