import { blogCollection, BlogDBType } from './db';
import { ObjectId } from 'mongodb';

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export const blogsQueryRepo = {
  async findBlogs(): Promise<BlogViewModel[]> {
    return (await blogCollection.find({}).toArray()).map((foundBlog) => this.blogWithReplaceId(foundBlog));
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!foundBlog) {
      return null;
    } else {
      return this.blogWithReplaceId(foundBlog);
    }
  },

  blogWithReplaceId(object: BlogDBType): BlogViewModel {
    return {
      id: object._id.toString(),
      name: object.name,
      description: object.description,
      websiteUrl: object.websiteUrl,
      createdAt: object.createdAt,
      isMembership: object.isMembership,
    };
  },
};
