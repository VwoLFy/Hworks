import {postCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeNewPost} from "../domain/posts-service";

export const postsRepository = {
    async createPost(newPost: TypeNewPost): Promise<string> {
        const newPostWithId = {...newPost, _id: new ObjectId()};
        await postCollection.insertOne(newPostWithId)
        return newPostWithId._id.toString()
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