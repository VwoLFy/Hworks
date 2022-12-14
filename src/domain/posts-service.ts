import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostType} from "../types/types";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<string | null> {
        const foundBlogName = await blogsRepository.findBlogNameById(blogId)
        if (!foundBlogName) {
            return null
        }
        const newPost: PostType = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundBlogName,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createPost(newPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content,blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async deleteAll() {
        await postsRepository.deleteAll()
    }
}