import {blogCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeBlogOutputModel = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
};
type TypeBlogFromDB = {
    _id: ObjectId
    name: string
    youtubeUrl: string
    createdAt: string
};

export const blogsQueryRepo = {
    async findBlogs(): Promise<TypeBlogOutputModel[]> {
        return (await blogCollection.find({}).toArray()).map( foundBlog => this.blogWithReplaceId(foundBlog) )
    },
    async findBlogById(id: string): Promise<TypeBlogOutputModel | null> {
        const foundBlog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!foundBlog) {
            return null
        } else {
            return this.blogWithReplaceId(foundBlog)
        }
    },
    blogWithReplaceId  (object: TypeBlogFromDB ): TypeBlogOutputModel  {
        return {
            id: object._id.toString(),
            name: object.name,
            youtubeUrl: object.youtubeUrl,
            createdAt: object.createdAt
        }
    }
}