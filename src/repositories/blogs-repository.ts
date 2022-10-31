import {blogCollection} from "./db";
import {ObjectId} from "mongodb";
import {TypeNewBlog} from "../domain/blogs-service";

export const blogsRepository = {
    async findBlogNameById(id: string): Promise<string | null> {
        const foundBlog = await blogCollection.findOne({ _id: new ObjectId(id) })
        if (!foundBlog) {
            return null
        }
        return foundBlog.name
    },
    async createBlog(newBlog: TypeNewBlog): Promise<string> {
        const newBlogWithId = {...newBlog, _id: new ObjectId()}
        await blogCollection.insertOne(newBlogWithId);
        return newBlogWithId._id.toString()
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {name, youtubeUrl}}
        );
        return result.matchedCount !== 0;
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await blogCollection.deleteMany({})
    }
}