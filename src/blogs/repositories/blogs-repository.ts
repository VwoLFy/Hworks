import {BlogModel, HDBlogType} from "../types/mongoose-schemas-models";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async saveBlog(blog: HDBlogType) {
        await blog.save()
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id});
        return result.deletedCount !== 0;
    }
    async deleteAll() {
        await BlogModel.deleteMany({})
    }
}