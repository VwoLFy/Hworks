export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

const blogs: BlogViewModel[] = [];

export const blogsRepository = {
  findBlogs(): BlogViewModel[] {
    return blogs;
  },

  findBlog(id: string): BlogViewModel | null {
    const foundBlog = blogs.find((b) => b.id === id);
    return foundBlog ?? null;
  },

  createBlog(dto: BlogInputModel): BlogViewModel {
    const { name, description, websiteUrl } = dto;

    const newBlog: BlogViewModel = {
      id: 'Blog' + (blogs.length + 1),
      name,
      description,
      websiteUrl,
    };
    blogs.push(newBlog);

    return newBlog;
  },

  updateBlog(id: string, dto: BlogInputModel): boolean {
    const { name, description, websiteUrl } = dto;

    const foundBlog = blogs.find((b) => b.id === id);
    if (!foundBlog) return false;

    foundBlog.name = name;
    foundBlog.description = description;
    foundBlog.websiteUrl = websiteUrl;

    return true;
  },

  deleteBlog(id: string): boolean {
    const foundBlog = blogs.find((b) => b.id === id);
    if (!foundBlog) return false;
    blogs.splice(blogs.indexOf(foundBlog), 1);
    return true;
  },

  deleteAll() {
    blogs.splice(0);
  },
};
