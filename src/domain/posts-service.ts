import {postsRepository} from "../repositories/posts-repository";
import {CreatePostDtoTypeR, HDPostType, PostClass, UpdatePostDtoTypeR} from "../types/types";
import {BlogModel, PostModel} from "../types/mongoose-schemas-models";

class PostsService{
    async createPost(dto: CreatePostDtoTypeR): Promise<string | null> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return null

        const newPost = new PostClass(dto.title, dto.shortDescription, dto.content, dto.blogId, foundBlogName)
        await PostModel.create(newPost)
        return newPost._id.toString()
    }
    async updatePost(id: string, dto: UpdatePostDtoTypeR): Promise<boolean> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post: HDPostType | null = await PostModel.findHDPost(id)
        if (!post) return false

        post.updatePost({...dto, blogName: foundBlogName})
        await postsRepository.savePost(post)
        return true
    }
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
    async deleteAll() {
        await postsRepository.deleteAll()
    }
}

export const postsService = new PostsService()