import {blogCollection, typeBlog} from "./db";
import {ObjectId} from "mongodb";

export const isIdValid = (id: string): boolean => {
    return ObjectId.isValid(id)
}

export const blogsRepository = {
    async findBlogs(): Promise<typeBlog[]> {
        return blogCollection.find({}).toArray()
    },
    async findBlog(id: string): Promise<typeBlog | null> {
        if ( !isIdValid(id) ) {
            return null
        }
        return blogCollection.findOne({_id: new ObjectId(id)})
    },
    async createBlog(name: string, youtubeUrl: string): Promise<typeBlog> {
        const newBlog: typeBlog = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogCollection.insertOne(newBlog)
        return newBlog;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        if ( !isIdValid(id) ) {
            return false
        }
        const result = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {name, youtubeUrl}}
        );
        return result.matchedCount !== 0;
    },
    async deleteBlog(id: string): Promise<boolean> {
        if ( !isIdValid(id) ) {
            return false
        }
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await blogCollection.deleteMany({})
    }
}