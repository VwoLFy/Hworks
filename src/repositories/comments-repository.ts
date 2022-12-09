import {TypeNewComment} from "../domain/comments-service";
import {TypeCommentDB} from "../types/types";
import {CommentModel} from "../types/mongoose-schemas-models";

export const commentsRepository = {
    async findUserIdByCommentId(id: string): Promise<string | null> {
        const foundComment: TypeCommentDB | null = await CommentModel.findById({_id: id})
        return foundComment ? foundComment.userId : null
    },
    async createComment (newComment: TypeNewComment): Promise<string> {
        const result = await CommentModel.create(newComment)
        return result.id
    },
    async updateComment(id: string, content: string): Promise<number | null> {
        const result = await CommentModel.updateOne(
            {_id: id},
            {$set: {content: content}}
        )
        if (!result.modifiedCount) {
            return null
        } else {
            return 204
        }
    },
    async deleteComment(id: string): Promise<number | null> {
        const result = await CommentModel.deleteOne({_id: id})
        if (!result.deletedCount) {
            return null
        } else {
            return 204
        }
    },
    async deleteAll() {
        CommentModel.deleteMany({})
    }
}