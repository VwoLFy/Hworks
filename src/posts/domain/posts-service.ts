import {PostsRepository} from "../repositories/posts-repository";
import {CreatePostDtoType, PostClass, UpdatePostDto} from "../types/types";
import {BlogModel} from "../../blogs/types/mongoose-schemas-models";
import {HDPostType, PostModel} from "../types/mongoose-schemas-models";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService{
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository) {}

    async createPost(dto: CreatePostDtoType): Promise<string | null> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return null

        const newPost = new PostClass(dto.title, dto.shortDescription, dto.content, dto.blogId, foundBlogName)
        await PostModel.create(newPost)
        return newPost._id.toString()
    }
    async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post: HDPostType | null = await PostModel.findHDPost(id)
        if (!post) return false

        post.updatePost({...dto, blogName: foundBlogName})
        await this.postsRepository.savePost(post)
        return true
    }
    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }
    async deleteAll() {
        await this.postsRepository.deleteAll()
    }
}