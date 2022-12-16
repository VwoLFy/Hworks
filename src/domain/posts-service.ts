import {postsRepository} from "../repositories/posts-repository";
import {CreatePostsByBlogIdR, HDPostType, UpdatePostTypeR} from "../types/types";
import {BlogModel, PostModel} from "../types/mongoose-schemas-models";

export const postsService = {
    async createPost(dto: CreatePostsByBlogIdR): Promise<string | null> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return null

        const newPost: HDPostType = await PostModel.createPost({...dto, blogName: foundBlogName})
        await postsRepository.savePost(newPost)
        return newPost.id
    },
    async updatePost(id: string, dto: UpdatePostTypeR): Promise<boolean> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post: HDPostType | null = await PostModel.findHDPost(id)
        if (!post) return false

        post.updatePost({...dto, blogName: foundBlogName})
        await postsRepository.savePost(post)
        return true
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async deleteAll() {
        await postsRepository.deleteAll()
    }
}