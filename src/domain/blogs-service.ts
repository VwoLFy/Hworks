import {blogsRepository} from "../repositories/blogs-repository";
import {TypeBlogDB} from "../repositories/db";

export type TypeBlog = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
};
export type TypeNewBlog = {
    name: string
    youtubeUrl: string
    createdAt: string
};

const blogWithReplaceId = (object: TypeBlogDB ): TypeBlog => {
    return {
        id: object._id.toString(),
        name: object.name,
        youtubeUrl: object.youtubeUrl,
        createdAt: object.createdAt
    }
}

export const blogsService = {
    async findBlogs(): Promise<TypeBlog[]> {
        return (await blogsRepository.findBlogs())
            .map( foundBlog => blogWithReplaceId(foundBlog) )
    },
    async findBlog(id: string): Promise<TypeBlog | null> {
        const foundBlog = await blogsRepository.findBlog(id)
        if (!foundBlog) {
            return null
        } else {
            return blogWithReplaceId(foundBlog)
        }
    },
    async createBlog(name: string, youtubeUrl: string): Promise<TypeBlog> {
        const newBlog: TypeNewBlog = {
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return blogWithReplaceId(createdBlog)
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, youtubeUrl);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id);
    },
    async deleteAll() {
        await blogsRepository.deleteAll()
    }
}