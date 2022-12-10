import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {TypeBlog} from "../types/types";

export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog: TypeBlog = {
            name,
            description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        }

        return await blogsRepository.createBlog(newBlog)
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, description, websiteUrl);
    },
    async deleteBlog(id: string): Promise<boolean> {
        const isDeletedBlog = await blogsRepository.deleteBlog(id);
        if (!isDeletedBlog) return false
        await postsRepository.deleteAllPostsOfBlog(id)
        return true
    },
    async deleteAll() {
        await blogsRepository.deleteAll()
    }
}