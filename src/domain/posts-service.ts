import {typePost} from "../repositories/db";
import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts-repository";
import {blogsService} from "./blogs-service";

const postWithReplaceId = (object: typePost ): typePost => {
    return {
        id: object._id?.toString(),
        title: object.title,
        shortDescription: object.shortDescription,
        content: object.content,
        blogId: object.blogId,
        blogName: object.blogName,
        createdAt: object.createdAt
    }
}

export const postsService = {
    async findPosts(): Promise<typePost[]> {
        return (await postsRepository.findPosts())
            .map( foundPost => postWithReplaceId(foundPost) )
    },
    async findPost(id: string): Promise<typePost | null> {
        const foundPost = await postsRepository.findPost(id)
        if (!foundPost) {
            return null
        } else {
            return postWithReplaceId(foundPost)
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<typePost | null> {
        const foundBlog = await blogsService.findBlog(blogId)
        if (!foundBlog) {
            return null
        }
        const newPost: typePost = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundBlog.name,
            createdAt: new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(newPost)
        return postWithReplaceId(createdPost)
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