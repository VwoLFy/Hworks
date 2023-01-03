import {CommentHDType, CommentModel} from "../domain/comment.schema";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {LikeHDType, LikeModel} from "../domain/like.schema";

@injectable()
export class CommentsRepository {
    async findComment(id: string): Promise<CommentHDType | null> {
        return CommentModel.findById({_id: id})
    }
    async saveComment(comment: CommentHDType): Promise<void> {
        await comment.save()
    }
    async findLikeStatus(commentId: string, userId: string): Promise<LikeHDType | null> {
        return LikeModel.findOne({commentId, userId})
    }
    async saveLike(like: LikeHDType): Promise<void> {
        await like.save()
    }
    async deleteAllCommentsOfPost(postId: string): Promise<boolean> {
        const result = await CommentModel.deleteMany({postId})
        return result.deletedCount !== 0
    }
    async deleteLike(_id: ObjectId): Promise<void> {
        await LikeModel.deleteOne({_id})
    }
    async deleteComment(_id: ObjectId): Promise<number | null> {
        const result = await CommentModel.deleteOne({_id})
        if (!result.deletedCount) {
            return null
        } else {
            await LikeModel.deleteMany({commentId: _id})
            return 204
        }
    }
    async deleteAll() {
        await CommentModel.deleteMany()
        await LikeModel.deleteMany()
    }
}