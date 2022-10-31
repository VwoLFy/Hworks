import {blogsRepository} from "../repositories/blogs-repository";

export type TypeNewBlog = {
    name: string
    youtubeUrl: string
    createdAt: string
};

export const blogsService = {
    async createBlog(name: string, youtubeUrl: string): Promise<string> {
        const newBlog: TypeNewBlog = {
            name,
            youtubeUrl,
            createdAt: new Date().toISOString()
        }
        return await blogsRepository.createBlog(newBlog)
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