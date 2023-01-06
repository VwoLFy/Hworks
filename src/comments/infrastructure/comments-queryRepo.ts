import {Comment, CommentModel} from "../domain/comment.schema";
import {injectable} from "inversify";
import {LikeModel} from "../domain/like.schema";
import {FindCommentsByPostIdDto} from "./dto/FindCommentsByPostIdDto";
import {CommentViewModel} from "../api/models/CommentViewModel";
import {CommentViewModelPage} from "../api/models/CommentViewModelPage";
import {LikeStatus} from "../../main/types/enums";

@injectable()
export class CommentsQueryRepo {
    async findCommentById(commentId: string, userId: string | null): Promise<CommentViewModel | null> {
        let foundComment: Comment | null = await CommentModel.findById({_id: commentId}).lean()
        if (!foundComment) return null

        return this.commentWithReplaceId(foundComment, userId)
    }
    async findCommentsByPostId(dto: FindCommentsByPostIdDto): Promise<CommentViewModelPage | null> {
        let {postId, page, pageSize, sortBy, sortDirection, userId} = dto

        sortBy = sortBy === 'id' ? '_id' : sortBy
        const sortOptions = {[sortBy]: sortDirection}
        const totalCount = await CommentModel.countDocuments({postId})
        if (!totalCount) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const commentsWith_id = (await CommentModel
            .find({postId})
            .skip( (page - 1) * pageSize)
            .limit(pageSize)
            .sort(sortOptions)
            .lean())

        let items: CommentViewModel[] = []
        for (let commentWith_id of commentsWith_id) {
            const item = await this.commentWithReplaceId(commentWith_id, userId)
            items = [...items, item]
        }

        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    }
    async commentWithReplaceId(comment: Comment, userId: string | null): Promise<CommentViewModel> {
        let myStatus: LikeStatus = LikeStatus.None
        if (userId) {
            const status = await LikeModel.findOne({commentId: comment._id, userId}).lean()
            if (status) myStatus = status.likeStatus
        }
        const likesInfo = {...comment.likesInfo, myStatus: myStatus}
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo
        }
    }
}