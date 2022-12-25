import {CommentClass, LikeClass, LikeCommentDtoType} from "../../main/types/types";
import {CommentModel, LikeModel} from "../../main/types/mongoose-schemas-models";
import {LikeStatus} from "../../main/types/enums";

export class CommentsRepository {
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
    async isCommentExist(id: string): Promise<boolean> {
        return !!(await CommentModel.findById({_id: id}).lean())
    }
    async newLikeStatus(like: LikeClass): Promise<void> {
        await LikeModel.create(like)
    }
    async updateLikeStatus({commentId, userId, likeStatus}: LikeCommentDtoType): Promise<boolean> {
        if (likeStatus === LikeStatus.None) {
            await LikeModel.deleteOne({commentId, userId})
            return true
        }
        const result = await LikeModel.updateOne({commentId, userId}, {$set: {likeStatus, createdAt: (new Date())}})
        return !!result.matchedCount
    }
    async updateLikesCount(commentId: string) {
        const likesCount = await LikeModel.countDocuments({commentId, likeStatus: 'Like'})
        const dislikesCount = await LikeModel.countDocuments({commentId, likeStatus: 'Dislike'})
        await CommentModel.updateOne(
            {_id: commentId},
            {$set:
                    {
                        'likesInfo.likesCount': likesCount,
                        'likesInfo.dislikesCount': dislikesCount
                    }
            }
        )
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
}