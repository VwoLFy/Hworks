import {CommentDocument, CommentModel} from "../domain/comment.schema";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
import {CommentLikeDocument, CommentLikeModel} from "../domain/commentLike.schema";

@injectable()
export class CommentsRepository {
    async findComment(id: string): Promise<CommentDocument | null> {
        return CommentModel.findById({_id: id})
    }
    async saveComment(comment: CommentDocument): Promise<void> {
        await comment.save()
    }
    async findLikeStatus(commentId: string, userId: string): Promise<CommentLikeDocument | null> {
        return CommentLikeModel.findOne({commentId, userId})
    }
    async saveLike(like: CommentLikeDocument): Promise<void> {
        await like.save()
    }
    async deleteAllCommentsOfPost(postId: string): Promise<boolean> {
        const result = await CommentModel.deleteMany({postId})
        return result.deletedCount !== 0
    }
    async deleteLike(_id: ObjectId): Promise<void> {
        await CommentLikeModel.deleteOne({_id})
    }
    async deleteComment(_id: ObjectId): Promise<number | null> {
        const result = await CommentModel.deleteOne({_id})
        if (!result.deletedCount) {
            return null
        } else {
            await CommentLikeModel.deleteMany({commentId: _id})
            return 204
        }
    }
    async deleteAll() {
        await CommentModel.deleteMany()
        await CommentLikeModel.deleteMany()
    }
}