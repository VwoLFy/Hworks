import { blogsRepository } from '../repositories/blogs-repository';
import { ObjectId } from 'mongodb';

export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type CreateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type UpdateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export const blogsService = {
  async createBlog(dto: CreateBlogDto): Promise<string> {
    const { name, description, websiteUrl } = dto;

    const newBlog: BlogType = {
      id: new ObjectId().toString(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    };
    await blogsRepository.createBlog(newBlog);

    return newBlog.id;
  },

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<boolean> {
    let blog = await blogsRepository.findBlogById(id);
    if (!blog) return false;

    blog = { ...blog, ...dto };
    return await blogsRepository.updateBlog(blog);
  },

  async deleteBlog(id: string): Promise<boolean> {
    let blog = await blogsRepository.findBlogById(id);
    if (!blog) return false;

    return await blogsRepository.deleteBlog(id);
  },

  async deleteAll() {
    await blogsRepository.deleteAll();
  },
};
