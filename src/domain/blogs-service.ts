import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {BlogModel} from "../types/mongoose-schemas-models";
import {CreateBlogType, HDBlogType, UpdateBlogType} from "../types/types";

export const blogsService = {
    async createBlog(dto: CreateBlogType): Promise<string> {
        const newBlog: HDBlogType = await BlogModel.createBlog(dto)
        await blogsRepository.blogSave(newBlog)
        return newBlog.id
    },
    async updateBlog(id: string, dto: UpdateBlogType): Promise<boolean> {
        const blog: HDBlogType | null = await BlogModel.findHDBlog(id)
        if (!blog) return false
        blog.updateBlog(dto)
        await blogsRepository.blogSave(blog)
        return true
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