import {BlogModel, BlogHDType} from "../types/mongoose-schemas-models";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async findBlogById(_id: string): Promise<BlogHDType | null> {
        return BlogModel.findById({_id})
    }
    async saveBlog(blog: BlogHDType) {
        await blog.save()
    }
    async deleteBlog(_id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id});
        return result.deletedCount !== 0;
    }
    async deleteAll() {
        await BlogModel.deleteMany({})
    }
}