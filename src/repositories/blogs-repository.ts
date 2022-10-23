import {blogCollection, typeBlog} from "./db";

export const blogsRepository = {
    async findBlogs(): Promise<typeBlog[]> {
        return blogCollection.find({}, {projection: {_id:0}}).toArray()
    },
    async findBlog(id: string): Promise<typeBlog | null> {
        return blogCollection.findOne({id}, {projection: {_id:0}})
    },
    async createBlog(name: string, youtubeUrl: string): Promise<typeBlog> {
        const newBlog: typeBlog = {
            id: "Blog" + ((await blogCollection.find().toArray()).length + 1),
            name,
            youtubeUrl
        }
        const newBlogWithoutId: typeBlog = Object.assign( {}, newBlog);
        await blogCollection.insertOne(newBlog)
        return newBlogWithoutId;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await blogCollection.updateOne(
            {id},
            {$set: {name, youtubeUrl}}
        );
        return result.matchedCount !== 0;

    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({id});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await blogCollection.deleteMany({})
    }
}