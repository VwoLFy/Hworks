import {BlogsRepository} from "../infrastructure/blogs-repository";
import {PostsRepository} from "../../posts/infrastructure/posts-repository";
import {BlogClass, CreateBlogDtoType, UpdateBlogDtoType} from "../types/types";
import {BlogModel, BlogHDType} from "../types/mongoose-schemas-models";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository) {}

    async createBlog(dto: CreateBlogDtoType): Promise<string> {
        const newBlog = new BlogClass(dto.name, dto.description, dto.websiteUrl)

        const blog: BlogHDType = new BlogModel(newBlog)
        await this.blogsRepository.saveBlog(blog)
        return blog.id
    }
    async updateBlog(id: string, dto: UpdateBlogDtoType): Promise<boolean> {
        const blog: BlogHDType | null = await this.blogsRepository.findBlogById(id)
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