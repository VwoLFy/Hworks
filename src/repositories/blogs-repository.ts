type typeBlog = {
    id: string
    name: string
    youtubeUrl: string
}
type typeBlogs = Array<typeBlog>

const blogs: typeBlogs = [{
    id: "testBlogId",
    name: "Wolf",
    youtubeUrl: "https://www.youtube.com/c/ITKAMASUTRA"
}];

export const blogsRepository = {
    findBlogs() {
        return blogs
    },
    findBlog(id: string) {
        const foundBlog = blogs.find(b => b.id === id);
        return foundBlog;
    },
    createBlog(name: string, youtubeUrl: string) {
        const newBlog: typeBlog = {
            id: "Blog" + (blogs.length + 1),
            name,
            youtubeUrl
        }
        blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, name: string, youtubeUrl: string) {
        const foundBlog = blogs.find(b => b.id === id);
        if (!foundBlog) return false;

        foundBlog.name = name;
        foundBlog.youtubeUrl = youtubeUrl
        return true;
    },
    deleteBlog(id: string) {
        const foundBlog = blogs.find(b => b.id === id);
        if (!foundBlog) return false;
        blogs.splice(blogs.indexOf(foundBlog), 1);
        return true;
    },
    deleteAll() {
        blogs.splice(0);
    }
}