import {ObjectId} from "mongodb";
import {commentCollection} from "./db";

type TypeCommentFromDB = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    createdAt: string
    postId: string
}
type TypeCommentOutputModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}

export const commentsQueryRepo = {
    async findCommentById(id: string): Promise<TypeCommentOutputModel | null> {
        const foundComment = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!foundComment) return null
        return this.commentWithReplaceId(foundComment)
    },
    commentWithReplaceId(comment: TypeCommentFromDB): TypeCommentOutputModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt

        }
    }
}