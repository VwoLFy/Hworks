import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../../posts/repositories/posts-repository";
import {BlogClass, CreateBlogDtoType, UpdateBlogDtoType} from "../types/types";
import {BlogModel, HDBlogType} from "../types/mongoose-schemas-models";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository) {}

    async createBlog(dto: CreateBlogDtoType): Promise<string> {
        const newBlog = new BlogClass(dto.name, dto.description, dto.websiteUrl)
        await BlogModel.create(newBlog)
        return newBlog._id.toString()
    }
    async updateBlog(id: string, dto: UpdateBlogDtoType): Promise<boolean> {
        const blog: HDBlogType | null = await BlogModel.findHDBlog(id)
        if (!blog) return false

        blog.updateBlog(dto)
        await this.blogsRepository.saveBlog(blog)
        return true
    }
    async deleteBlog(id: string): Promise<boolean> {
        const isDeletedBlog = await this.blogsRepository.deleteBlog(id);
        if (!isDeletedBlog) return false
        await this.postsRepository.deleteAllPostsOfBlog(id)
        return true
    }
    async deleteAll() {
        await this.blogsRepository.deleteAll()
    }
}