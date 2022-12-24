import {CommentClass} from "../types/types";
import {CommentModel} from "../types/mongoose-schemas-models";

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
    async deleteComment(id: string): Promise<number | null> {
        const result = await CommentModel.deleteOne({_id: id})
        if (!result.deletedCount) {
            return null
        } else {
            return 204
        }
    }
    async deleteAll() {
        await CommentModel.deleteMany({})
    }
}