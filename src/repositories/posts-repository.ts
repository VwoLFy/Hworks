import {postCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeNewPost} from "../domain/posts-service";

export const postsRepository = {
    async createPost(newPost: TypeNewPost): Promise<string> {
        const result = await postCollection.insertOne(newPost)
        return result.insertedId.toString()
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
    async isPostExist (id: string): Promise<boolean> {
        return !!( await postCollection.findOne({_id: new ObjectId(id)}) )
    },
    async deleteAllPostsOfBlog(id: string): Promise<boolean> {
        const result = await postCollection.deleteMany({blogId: id})
        return result.deletedCount !== 0
    },
    async deleteAll() {
        await postCollection.deleteMany( {})
    }
}