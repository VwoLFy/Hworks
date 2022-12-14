import {BlogModel} from "../types/mongoose-schemas-models";
import {HDBlogType, BlogType} from "../types/types";

export const blogsRepository = {
    async findBlogNameById(id: string): Promise<string | null> {
        const foundBlog: BlogType | null = await BlogModel.findById({_id: id})
        if (!foundBlog) {
            return null
        }
        return foundBlog.name
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await BlogModel.deleteMany({})
    },
    async findBlogById(id: string): Promise<HDBlogType | null> {
        return BlogModel.findById(id)
    },
    async blogSave(blog: HDBlogType) {
        await blog.save()
    }
}