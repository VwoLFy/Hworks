import {blogCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeBlog = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
};
type TypeBlogDB = {
    _id: ObjectId
    name: string
    youtubeUrl: string
    createdAt: string
};

export const blogsQueryRepo = {
    async findBlogs(): Promise<TypeBlog[]> {
        return (await blogCollection.find({}).toArray()).map( foundBlog => this.blogWithReplaceId(foundBlog) )
    },
    async findBlogById(id: string): Promise<TypeBlog | null> {
        const foundBlog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!foundBlog) {
            return null
        } else {
            return this.blogWithReplaceId(foundBlog)
        }
    },
    blogWithReplaceId  (object: TypeBlogDB ): TypeBlog  {
        return {
            id: object._id.toString(),
            name: object.name,
            youtubeUrl: object.youtubeUrl,
            createdAt: object.createdAt
        }
    }
}