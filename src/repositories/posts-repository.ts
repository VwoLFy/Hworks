import {postCollection, TypePostDB} from "./db";
import {ObjectId} from "mongodb";
import {TypeNewPost} from "../domain/posts-service";

export const postsRepository = {
/*
    async findPosts(): Promise<TypePostDB[]> {
        return await postCollection.find({}).toArray()
    },
    async findPost(id: string): Promise<TypePostDB | null> {
        return await postCollection.findOne({_id: new ObjectId(id)})
    },
*/
    async createPost(newPost: TypeNewPost): Promise<TypePostDB> {
        const newPostWithId = {...newPost, _id: new ObjectId()};
        await postCollection.insertOne(newPostWithId)
        return newPostWithId
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