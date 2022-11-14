import {commentCollection} from "./db";
import {TypeNewComment} from "../domain/comments-service";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async createComment (newComment: TypeNewComment): Promise<string> {
        const result = await commentCollection.insertOne(newComment)
        return result.insertedId.toString()
    },
    async findUserIdByCommentId(id: string): Promise<string | null> {
        const foundComment = await commentCollection.findOne({_id: new ObjectId(id)})
        return foundComment ? foundComment.userId : null
    },
    async updateComment(id: string, content: string): Promise<number | null> {
        const result = await commentCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {content: content}}
        )
        if (!result.modifiedCount) {
            return null
        } else {
            return 204
        }
    },
    async deleteComment(id: string): Promise<number | null> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})
        if (!result.deletedCount) {
            return null
        } else {
            return 204
        }
    },
    async deleteAll() {
        commentCollection.deleteMany({})
    }
}