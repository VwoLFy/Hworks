import { postsRepository } from '../repositories/posts-repository';
import { blogsRepository } from '../repositories/blogs-repository';
import { ObjectId } from 'mongodb';
import { BlogType } from './blogs-service';

export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type CreatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type UpdatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export const postsService = {
  async createPost(dto: CreatePostDto): Promise<string | null> {
    const { title, shortDescription, content, blogId } = dto;

    const foundBlog = await blogsRepository.findBlogById(blogId);
    if (!foundBlog) {
      return null;
    }
    const newPost: PostType = {
      id: new ObjectId().toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: foundBlog.name,
      createdAt: new Date().toISOString(),
    };
    await postsRepository.createPost(newPost);

    return newPost.id;
  },

  async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
    let post = await postsRepository.findPostById(id);
    if (!post) return false;

    const blog = await blogsRepository.findBlogById(dto.blogId);
    if (!blog) return false;

    post = this.updatePostData(post, dto, blog);

    return await postsRepository.updatePost(post);
  },

  async deletePost(id: string): Promise<boolean> {
    let post = await postsRepository.findPostById(id);
    if (!post) return false;

    return await postsRepository.deletePost(id);
  },

  async deleteAll() {
    await postsRepository.deleteAll();
  },

  updatePostData(post: PostType, dto: UpdatePostDto, blog: BlogType): PostType {
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blog.name;

    return post;
  },
};
