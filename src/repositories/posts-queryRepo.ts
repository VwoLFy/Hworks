import {ObjectId} from "mongodb";
import {postCollection} from "./db";

type TypePost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
type TypePostDB = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export const postsQueryRepo = {
    async findPosts(): Promise<TypePost[]> {
        return (await postCollection.find({}).toArray()).map( foundPost => this.postWithReplaceId(foundPost) )
    },
    async findPost(id: string): Promise<TypePost | null> {
        const foundPost = await postCollection.findOne({_id: new ObjectId(id)})
        if (!foundPost) {
            return null
        } else {
            return this.postWithReplaceId(foundPost)
        }
    },
    postWithReplaceId (object: TypePostDB ): TypePost {
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