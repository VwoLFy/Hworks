import {blogCollection} from "./db";
import {ObjectId} from "mongodb";

type TypeBlogOutputModel = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
};
type TypeBlogOutputPage = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: TypeBlogOutputModel[]
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
    async findBlogs(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string, sortDirectionStr: any): Promise<TypeBlogOutputPage> {
        const filterFind: { name?: { $regex: string, $options: 'i' } } = {};
        if (searchNameTerm) filterFind.name = {$regex: searchNameTerm, $options: 'i'}

        const optionsSort: { [key: string]: any } = {};
        optionsSort[sortBy] = sortDirection[sortDirectionStr]

        const totalCount = await blogCollection.count(filterFind)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber;

        const items = (await blogCollection.find(filterFind)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(optionsSort)
            .toArray())
            .map(foundBlog => this.blogWithReplaceId(foundBlog))
        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
    },
    async findBlogById(id: string): Promise<TypeBlogOutputModel | null> {
        const foundBlog = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!foundBlog) {
            return null
        } else {
            return this.blogWithReplaceId(foundBlog)
        }
    },
    blogWithReplaceId(object: TypeBlogFromDB): TypeBlogOutputModel {
        return {
            id: object._id.toString(),
            name: object.name,
            youtubeUrl: object.youtubeUrl,
            createdAt: object.createdAt
        }
    }
}