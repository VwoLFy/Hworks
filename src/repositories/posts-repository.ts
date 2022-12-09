import {TypeNewPost} from "../domain/posts-service";
import {PostModel} from "../types/mongoose-schemas-models";

export const postsRepository = {
    async createPost(newPost: TypeNewPost): Promise<string> {
        const result = await PostModel.create(newPost)
        return result.id
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostModel.updateOne(
            {_id: id},
            {$set: {title, shortDescription, content, blogId}}
        );
        return result.matchedCount !== 0
    },
    async isPostExist(id: string): Promise<boolean> {
        return !!(await PostModel.findById({_id: id}))
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: id})
        return result.deletedCount !== 0
    },
    async deleteAllPostsOfBlog(id: string): Promise<boolean> {
        const result = await PostModel.deleteMany({blogId: id})
        return result.deletedCount !== 0
    },
    async deleteAll() {
        await PostModel.deleteMany({})
    }
}