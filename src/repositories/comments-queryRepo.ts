import {ObjectId} from "mongodb";
import {commentCollection} from "./db";
import {SortDirection} from "../types/enums";
import {TypeCommentDB} from "../types/types";

type TypeCommentOutputModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
}
type TypeCommentOutputPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:  TypeCommentOutputModel[]
}

export const commentsQueryRepo = {
    async findCommentById(id: string): Promise<TypeCommentOutputModel | null> {
        const foundComment: TypeCommentDB | null = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!foundComment) return null
        return this.commentWithReplaceId(foundComment)
    },
    async findCommentsByPostId(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<TypeCommentOutputPage | null> {
        sortBy = sortBy === 'id' ? '_id' : sortBy
        const sortOptions = {[sortBy]: sortDirection}
        const totalCount = await commentCollection.count({postId})
        if (!totalCount) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const items = (await commentCollection
            .find({postId})
            .skip( (page - 1) * pageSize)
            .limit(pageSize)
            .sort(sortOptions)
            .toArray()).map(c => this.commentWithReplaceId(c))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    commentWithReplaceId(comment: TypeCommentDB): TypeCommentOutputModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt

        }
    },

}