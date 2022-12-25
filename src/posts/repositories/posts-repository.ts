import {HDPostType, PostModel} from "../types/mongoose-schemas-models";

export class PostsRepository{
    async savePost(newPost: HDPostType) {
        await newPost.save()
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: id})
        return result.deletedCount !== 0
    }
    async deleteAllPostsOfBlog(id: string): Promise<boolean> {
        const result = await PostModel.deleteMany({blogId: id})
        return result.deletedCount !== 0
    }
    async deleteAll() {
        await PostModel.deleteMany({})
    }
}