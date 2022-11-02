import {ObjectId} from "mongodb";
import {postCollection} from "./db";

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
type TypePostFromDB = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

enum sortDirection {
    asc = 1,
    desc = -1
}

export const postsQueryRepo = {
    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirectionStr: any): Promise<TypePostOutputPage> {
        const optionsSort: { [key: string]: any } = {};
        optionsSort[sortBy] = sortDirection[sortDirectionStr]

        const totalCount = await postCollection.count({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await postCollection.find({})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .toArray())
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
        const foundPost = await postCollection.findOne({_id: new ObjectId(id)})
        if (!foundPost) {
            return null
        } else {
            return this.postWithReplaceId(foundPost)
        }
    },
    postWithReplaceId (object: TypePostFromDB ): TypePostOutputModel {
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