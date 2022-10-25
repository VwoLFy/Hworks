import {blogsRepository} from "./blogs-repository";
import {postCollection, typePost} from "./db";
import {ObjectId} from "mongodb";

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

export const postsRepository = {
    async findPosts(): Promise<typePost[]> {
        return (await postCollection.find({}).toArray())
            .map( foundPost => postWithReplaceId(foundPost) )
    },
    async findPost(id: string): Promise<typePost | null> {
        const foundPost = await postCollection.findOne({_id: new ObjectId(id)})
        if (!foundPost) {
            return null
        } else {
            return postWithReplaceId(foundPost)
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<typePost> {
        const newPost: typePost = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: (await blogsRepository.findBlog(blogId))?.name || "",
            createdAt: new Date().toISOString()
        }
        await postCollection.insertOne(newPost)
        return postWithReplaceId(newPost)
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {title, shortDescription, content, blogId}}
        );
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne(
            {_id: new ObjectId(id)}
        );
        return result.deletedCount !== 0
    },
    async deleteAll() {
        await postCollection.deleteMany( {})
    }
}