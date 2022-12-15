import {BlogModel} from "../types/mongoose-schemas-models";
import {HDBlogType} from "../types/types";

export const blogsRepository = {
    async blogSave(blog: HDBlogType) {
        await blog.save()
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id});
        return result.deletedCount !== 0;
    },
    async deleteAll() {
        await BlogModel.deleteMany({})
    }
}