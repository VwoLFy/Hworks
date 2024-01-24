import { blogCollection, BlogDBType } from './db';
import { ObjectId } from 'mongodb';
import { BlogType } from '../domain/blogs-service';
import { converters } from './converters';

export const blogsRepository = {
  async findBlogById(id: string): Promise<BlogType | null> {
    const foundBlog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!foundBlog) return null;

    return converters._id<BlogDBType, BlogType>(foundBlog);
  },

  async createBlog(blog: BlogType): Promise<void> {
    const blogDB = converters.id<BlogType, BlogDBType>(blog);

    const result = await blogCollection.insertOne(blogDB);
    if (!result.acknowledged) throw new Error('Can`t create');
  },

  async updateBlog(blog: BlogType): Promise<boolean> {
    const { id, name, description, websiteUrl } = blog;
    const result = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    );
    return result.matchedCount !== 0;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount !== 0;
  },

  async deleteAll() {
    await blogCollection.deleteMany({});
  },
};
