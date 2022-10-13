import {blogsRepository} from "./blogs-repository";

type typePost = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
type typePosts = Array<typePost>

const posts: typePosts = [{
    id: "testPostId",
    title: "My Test Post",
    shortDescription: "MTP",
    content: "Text about content",
    blogId: "testBlogId",
    blogName: "Wolf"
}]

export const postsRepository = {
    findPosts() {
        return posts;
    },
    findPost(id: string) {
        const foundPost = posts.find(p => p.id === id);
        return foundPost;
    },
    createPost (title: string, shortDescription: string, content: string, blogId: string) {
        const newPost: typePost = {
            id: "Post" + (posts.length + 1),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogsRepository.findBlog(blogId).name
        }
        posts.push(newPost);
        return newPost
    },
    updatePost (id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundPost = posts.find(p => p.id === id);
        if (!foundPost) return false;
        foundPost.title = title;
        foundPost.shortDescription = shortDescription;
        foundPost.content = content;
        foundPost.blogId = blogId;
        return true
    },
    deletePost (id: string) {
        const foundPost = posts.find(p => p.id === id);
        if (!foundPost) return false;
        posts.splice(posts.indexOf(foundPost), 1)
        return true
    },
    deleteAll() {
        posts.splice(0)
    }

}