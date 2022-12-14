import {SortDirection} from "../types/enums";
import {TypePostDB} from "../types/types";
import {PostModel} from "../types/mongoose-schemas-models";

type TypePostOutputModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
type TypePostOutputPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TypePostOutputModel[]
};

export const postsQueryRepo = {
    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<TypePostOutputPage> {
        const optionsSort: { [key: string]: SortDirection } = {};
        sortBy = sortBy === 'id' ? '_id' : sortBy
        optionsSort[sortBy] = sortDirection

        const totalCount = await PostModel.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await PostModel.find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .lean())
            .map(foundBlog => this.postWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findPostById(id: string): Promise<TypePostOutputModel | null> {
        const foundPost: TypePostDB | null = await PostModel.findById({_id: id}).lean()
        if (!foundPost) {
            return null
        } else {
            return this.postWithReplaceId(foundPost)
        }
    },
    async findPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<TypePostOutputPage | null> {
        const optionsSort: { [key: string]: SortDirection } = {};
        sortBy = sortBy === 'id' ? '_id' : sortBy
        optionsSort[sortBy] = sortDirection

        const totalCount = await PostModel.countDocuments({blogId})
        if (totalCount == 0) return null

        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await PostModel.find({blogId})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .lean())
            .map(foundBlog => this.postWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    postWithReplaceId (object: TypePostDB ): TypePostOutputModel {
        return {
            id: object._id.toString(),
            title: object.title,
            shortDescription: object.shortDescription,
            content: object.content,
            blogId: object.blogId,
            blogName: object.blogName,
            createdAt: object.createdAt
        }
    }
}