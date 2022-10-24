import {blogsRepository} from "./blogs-repository";
import {postCollection, typePost} from "./db";

export const postsRepository = {
    async findPosts(): Promise<typePost[]> {
        return postCollection.find({}, {projection: {_id:0}}).toArray();
    },
    async findPost(id: string): Promise<typePost | null> {
        return postCollection.findOne( {id}, {projection: {_id:0}})
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<typePost> {
        const newPost: typePost = {
            id: "Post" + ( ( await postCollection.find().toArray()).length + 1),
            title,
            shortDescription,
            content,
            blogId,
            blogName: (await blogsRepository.findBlog(blogId))?.name || "",
            createdAt: new Date().toISOString()
        }
        const newPostWithoutId: typePost = Object.assign( {}, newPost);
        await postCollection.insertOne(newPost)
        return newPostWithoutId
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postCollection.updateOne(
            {id},
            {$set: {title, shortDescription, content, blogId}}
        );
        return result.matchedCount !== 0
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne(
            {id}
        );
        return result.deletedCount !== 0
    },
    async deleteAll() {
        await postCollection.deleteMany( {})
    }
}