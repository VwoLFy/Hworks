import { blogsRepository } from './blogs-repository';

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
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

const posts: PostViewModel[] = [];

export const postsRepository = {
  findPosts(): PostViewModel[] {
    return posts;
  },

  findPostById(id: string): PostViewModel | null {
    const foundPost = posts.find((p) => p.id === id);
    return foundPost ?? null;
  },

  createPost(dto: CreatePostDto): PostViewModel {
    const { title, shortDescription, content, blogId } = dto;

    const blogName = blogsRepository.findBlog(blogId)?.name ?? '';

    const newPost: PostViewModel = {
      id: 'Post' + (posts.length + 1),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    posts.push(newPost);

    return newPost;
  },

  updatePost(id: string, dto: UpdatePostDto): boolean {
    const { title, shortDescription, content, blogId } = dto;

    const foundPost = posts.find((p) => p.id === id);
    if (!foundPost) return false;
    foundPost.title = title;
    foundPost.shortDescription = shortDescription;
    foundPost.content = content;
    foundPost.blogId = blogId;
    return true;
  },

  deletePost(id: string): boolean {
    const foundPost = posts.find((p) => p.id === id);
    if (!foundPost) return false;
    posts.splice(posts.indexOf(foundPost), 1);
    return true;
  },

  deleteAll() {
    posts.splice(0);
  },
};
