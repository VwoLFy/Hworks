import {BlogModel, BlogDocument} from "../domain/blog.schema";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async findBlogById(_id: string): Promise<BlogDocument | null> {
        return BlogModel.findById({_id})
    }
    async saveBlog(blog: BlogDocument) {
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