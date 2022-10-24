import {blogsRepository, isIdValid} from "./blogs-repository";
import {postCollection, typePost} from "./db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findPosts(): Promise<typePost[]> {
        return postCollection.find({}).toArray();
    },
    async findPost(id: string): Promise<typePost | null> {
        if ( !isIdValid(id) ) {
            return null
        }
        return postCollection.findOne( {_id: new ObjectId(id)})
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
        return newPost
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        if ( !isIdValid(id) ) {
            return false
        }
        const result = await postCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {title, shortDescription, content, blogId}}
        );
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        if ( !isIdValid(id) ) {
            return false
        }
        const result = await postCollection.deleteOne(
            {_id: new ObjectId(id)}
        );
        return result.deletedCount !== 0
    },
    async deleteAll() {
        await postCollection.deleteMany( {})
    }
}