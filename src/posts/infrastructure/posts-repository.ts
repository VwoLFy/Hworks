import {PostHDType, PostModel} from "../domain/post.schema";
import {injectable} from "inversify";

@injectable()
export class PostsRepository{
    async findPostById (_id: string): Promise<PostHDType | null> {
        return PostModel.findById(_id)
    }
    async savePost(newPost: PostHDType) {
        await newPost.save()
    }
    async deletePost(_id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id})
        return result.deletedCount !== 0
    }
    async deleteAllPostsOfBlog(blogId: string): Promise<boolean> {
        const result = await PostModel.deleteMany({blogId})
        return result.deletedCount !== 0
    }
    async deleteAll() {
        await PostModel.deleteMany({})
    }
}