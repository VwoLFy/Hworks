import {postCollection, typePost} from "./db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async findPosts(): Promise<typePost[]> {
        return await postCollection.find({}).toArray()
    },
    async findPost(id: string): Promise<typePost | null> {
        return await postCollection.findOne({_id: new ObjectId(id)})
    },
    async createPost(newPost: typePost): Promise<typePost> {
        await postCollection.insertOne(newPost)
        return newPost
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