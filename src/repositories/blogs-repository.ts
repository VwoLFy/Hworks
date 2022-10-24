import {blogCollection, typeBlog} from "./db";
import {ObjectId} from "mongodb";

export const isIdValid = (id: string): boolean => {
    return ObjectId.isValid(id)
}

const blogWithReplaceId = (object: typeBlog ): typeBlog => {
    return {
        id: object._id?.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export const blogsRepository = {
    async findBlogs(): Promise<typeBlog[]> {
        return (await blogCollection.find({}).toArray())
            .map( foundBlog => blogWithReplaceId(foundBlog) )
    },
    async findBlog(id: string): Promise<typeBlog | null> {
        if (!isIdValid(id)) {
            return null
        }
        const foundBlog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!foundBlog) {
            return null
        } else {
            return blogWithReplaceId(foundBlog)
        }
    },
    async createBlog(name: string, youtubeUrl: string): Promise<typeBlog> {
        const newBlog: typeBlog = {
            _id: new ObjectId(),
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogCollection.insertOne(newBlog)
        return blogWithReplaceId(newBlog)
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        if (!isIdValid(id)) {
            return false
        }
        const result = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {name, youtubeUrl}}
        );
        return result.matchedCount !== 0;
    },
    async deleteBlog(id: string): Promise<boolean> {
        if (!isIdValid(id)) {
            return false
        }
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await blogCollection.deleteMany({})
    }
}