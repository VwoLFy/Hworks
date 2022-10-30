import {blogCollection, typeBlog} from "./db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async findBlogs(): Promise<typeBlog[]> {
        return await blogCollection.find({}).toArray()
    },
    async findBlog(id: string): Promise<typeBlog | null> {
        return await blogCollection.findOne({_id: new ObjectId(id)})
    },
    async createBlog(newBlog: typeBlog): Promise<typeBlog> {
        await blogCollection.insertOne(newBlog);
        return newBlog
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