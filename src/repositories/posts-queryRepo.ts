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
type TypePostFromDB = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export const postsQueryRepo = {
    async findPosts(): Promise<TypePostOutputModel[]> {
        return (await postCollection.find({}).toArray()).map( foundPost => this.postWithReplaceId(foundPost) )
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