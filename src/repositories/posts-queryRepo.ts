import {FindPostsByBlogId, FindPostsType} from "../types/types";
import {PostModel} from "../types/mongoose-schemas-models";

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

export const postsQueryRepo = {
    async findPosts(dto: FindPostsType): Promise<PostOutputPageType> {
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
    },
    async findPostById(id: string): Promise<PostOutputModelType | null> {
        const foundPost: PostOutputModelType | null = await PostModel.findPostWithId(id)
        return foundPost ? foundPost : null
    },
    async findPostsByBlogId(dto: FindPostsByBlogId): Promise<PostOutputPageType | null> {
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
    },}