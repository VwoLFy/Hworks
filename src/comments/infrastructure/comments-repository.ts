import {CommentClass} from "../types/types";
import {CommentHDType, CommentModel, LikeHDType, LikeModel} from "../types/mongoose-schemas-models";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async findComment(id: string): Promise<CommentHDType | null> {
        return CommentModel.findById({_id: id})
    }
    async findUserIdByCommentId(id: string): Promise<string | null> {
        const foundComment: CommentClass | null = await CommentModel.findById({_id: id})
        return foundComment ? foundComment.userId : null
    }
    async createComment (newComment: CommentClass): Promise<string> {
        const result = await CommentModel.create(newComment)
        return result.id
    }
    async updateComment(id: string, content: string): Promise<number | null> {
        const result = await CommentModel.updateOne(
            {_id: id},
            {$set: {content}}
        )
        if (!result.modifiedCount) {
            return null
        } else {
            return 204
        }
    }
    async findLikeStatus(commentId: string, userId: string): Promise<LikeHDType | null> {
        return LikeModel.findOne({commentId, userId})
    }
    async deleteComment(id: string): Promise<number | null> {
        const result = await CommentModel.deleteOne({_id: id})
        if (!result.deletedCount) {
            return null
        } else {
            return 204
        }
    }
    async deleteAll() {
        await CommentModel.deleteMany()
        await LikeModel.deleteMany()
    }
    async saveCommentAndLike(foundComment: CommentHDType, like: LikeHDType): Promise<void> {
        await foundComment.save()
        await like.save()
    }
}