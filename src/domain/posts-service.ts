import {TypePostDB} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export type TypePost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type TypeNewPost = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

const postWithReplaceId = (object: TypePostDB ): TypePost => {
    return {
        id: object._id.toString(),
        title: object.title,
        shortDescription: object.shortDescription,
        content: object.content,
        blogId: object.blogId,
        blogName: object.blogName,
        createdAt: object.createdAt
    }
}

export const postsService = {
/*
    async findPosts(): Promise<TypePost[]> {
        return (await postsRepository.findPosts())
            .map( foundPost => postWithReplaceId(foundPost) )
    },
    async findPost(id: string): Promise<TypePost | null> {
        const foundPost = await postsRepository.findPost(id)
        if (!foundPost) {
            return null
        } else {
            return postWithReplaceId(foundPost)
        }
    },
*/
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<TypePost | null> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (!foundBlog) {
            return null
        }
        const newPost: TypeNewPost = {
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