import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {BlogModel} from "../types/mongoose-schemas-models";
import {BlogClass, CreateBlogDtoType, HDBlogType, UpdateBlogDtoType} from "../types/types";

class BlogsService{
    async createBlog(dto: CreateBlogDtoType): Promise<string> {
        const newBlog = new BlogClass(dto.name, dto.description, dto.websiteUrl)
        await BlogModel.create(newBlog)
        return newBlog._id.toString()
    }
    async updateBlog(id: string, dto: UpdateBlogDtoType): Promise<boolean> {
        const blog: HDBlogType | null = await BlogModel.findHDBlog(id)
        if (!blog) return false

        blog.updateBlog(dto)
        await blogsRepository.saveBlog(blog)
        return true
    }
    async deleteBlog(id: string): Promise<boolean> {
        const isDeletedBlog = await blogsRepository.deleteBlog(id);
        if (!isDeletedBlog) return false
        await postsRepository.deleteAllPostsOfBlog(id)
        return true
    }
    async deleteAll() {
        await blogsRepository.deleteAll()
    }
}

export const blogsService = new BlogsService()