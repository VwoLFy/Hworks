import {Post, PostModel} from "../domain/post.schema";
import {injectable} from "inversify";
import {FindPostsQueryModel} from "../api/models/FindPostsQueryModel";
import {PostViewModel} from "../api/models/PostViewModel";
import {PostsViewModelPage} from "../api/models/PostsViewModelPage";
import {LikeStatus} from "../../main/types/enums";
import {PostLikeModel} from "../domain/postLike.schema";


@injectable()
export class PostsQueryRepo{
    async findPosts(dto: FindPostsQueryModel, userId: string | null): Promise<PostsViewModelPage> {
        let {pageNumber, pageSize} = dto;

        const totalCount = await PostModel.countDocuments()
        const pagesCount = Math.ceil(totalCount / pageSize)

        const postsWith_id = await PostModel.findPosts(dto)

        let items: PostViewModel[] = []
        for (let postWith_id of postsWith_id) {
            const item = await this.postWithReplaceId(postWith_id, userId)
            items = [...items, item]
        }

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async findPostById(_id: string, userId: string | null): Promise<PostViewModel | null> {
        const foundPost = await PostModel.findById({_id}).lean()
        if (!foundPost) return null

        return this.postWithReplaceId(foundPost, userId)
    }
    async findPostsByBlogId(blogId: string, userId: string | null, dto: FindPostsQueryModel): Promise<PostsViewModelPage | null> {
        let {pageNumber, pageSize} = dto

        const totalCount = await PostModel.countPostsByBlogId(blogId)
        if (totalCount == 0) return null

        const pagesCount = Math.ceil(totalCount / pageSize)

        const postsWith_id = await PostModel.findPostsByBlogId(blogId, dto)

        let items: PostViewModel[] = []
        for (let postWith_id of postsWith_id) {
            const item = await this.postWithReplaceId(postWith_id, userId)
            items = [...items, item]
        }

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items
        }
    }
    async postWithReplaceId(post: Post, userId: string | null): Promise<PostViewModel> {
        let myStatus: LikeStatus = LikeStatus.None
        if (userId) {
            const status = await PostLikeModel.findOne({postId: post._id, userId}).lean()
            if (status) myStatus = status.likeStatus
        }
        const newestLikes = await PostLikeModel
            .find({postId: post._id, likeStatus: LikeStatus.Like})
            .limit(3)
            .sort('-addedAt')
            .select({_id: 0, addedAt: 1, userId:1, login: 1})

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus,
                newestLikes
            }
        }
    }
}