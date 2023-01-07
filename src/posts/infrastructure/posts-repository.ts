import {PostDocument, PostModel} from "../domain/post.schema";
import {injectable} from "inversify";
import {PostLikeDocument, PostLikeModel} from "../domain/postLike.schema";

@injectable()
export class PostsRepository{
    async findPostById (_id: string): Promise<PostDocument | null> {
        return PostModel.findById(_id)
    }
    async savePost(newPost: PostDocument) {
        await newPost.save()
    }
    async findPostLike(postId: string, userId: string): Promise<PostLikeDocument | null> {
        return PostLikeModel.findOne({postId, userId})
    }
    async savePostLike(like: PostLikeDocument) {
        await like.save()
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
        await PostModel.deleteMany()
        await PostLikeModel.deleteMany()
    }
}