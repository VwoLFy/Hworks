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

enum sortDirection {
    asc = 1,
    desc = -1
}

export const blogsQueryRepo = {
    async findBlogs(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string, sortDirectionStr: any): Promise<TypeBlogOutputModel[]> {
        const filter = {};
        if (searchNameTerm) filter.name = { $regex: searchNameTerm, $options: 'i'}
        const sort = {}
        sort[sortBy] = sortDirection[sortDirectionStr]
        console.log(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection[sortDirectionStr], filter, sort)
        return (await blogCollection.find(filter).sort( sort ).toArray()).map( foundBlog => this.blogWithReplaceId(foundBlog) )
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