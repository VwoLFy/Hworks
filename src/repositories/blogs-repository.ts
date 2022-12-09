import {TypeNewBlog} from "../domain/blogs-service";
import {BlogModel} from "../types/mongoose-schemas-models";
import {TypeBlogDB} from "../types/types";

export const blogsRepository = {
    async findBlogNameById(id: string): Promise<string | null> {
        const foundBlog: TypeBlogDB | null = await BlogModel.findById({_id: id})
        if (!foundBlog) {
            return null
        }
        return foundBlog.name
    },
    async createBlog(newBlog: TypeNewBlog): Promise<string> {
        const result = await BlogModel.create(newBlog);
        return result.id
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModel.updateOne(
            {_id: id},
            {$set: {name, description, websiteUrl}}
        );
        return result.matchedCount !== 0;
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await BlogModel.deleteMany({})
    }
}