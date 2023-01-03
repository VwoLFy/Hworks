import {BlogsRepository} from "../infrastructure/blogs-repository";
import {PostsRepository} from "../../posts/infrastructure/posts-repository";
import {UpdateBlogDto} from "./dto/UpdateBlogDto";
import {BlogModel, BlogDocument, Blog} from "../domain/blog.schema";
import {inject, injectable} from "inversify";
import {CreateBlogDto} from "./dto/CreateBlogDto";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository) {}

    async createBlog(dto: CreateBlogDto): Promise<string> {
        const newBlog = new Blog(dto.name, dto.description, dto.websiteUrl)

        const blog = new BlogModel(newBlog)
        await this.blogsRepository.saveBlog(blog)
        return blog.id
    }
    async updateBlog(id: string, dto: UpdateBlogDto): Promise<boolean> {
        const blog: BlogDocument | null = await this.blogsRepository.findBlogById(id)
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