import {commentCollection} from "./db";
import {TypeNewComment} from "../domain/comments-service";

export const commentsRepository = {
    async createComment (newComment: TypeNewComment): Promise<string> {
        const result = await commentCollection.insertOne(newComment)
        return result.insertedId.toString()
    }
}