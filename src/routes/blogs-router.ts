import {Router} from "express";
import {
    createBlogValidation,
    createPostsByBlogIdValidation,
    deleteBlogValidation,
    getBlogsValidation,
    getBlogValidation,
    getPostsByBlogIdValidation,
    updateBlogValidation
} from "../middlewares/blog-validators";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({});

blogsRouter.get('/', getBlogsValidation, blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', getBlogValidation, blogsController.getBlog.bind(blogsController))
blogsRouter.post('/', createBlogValidation, blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', updateBlogValidation, blogsController.updateBlog.bind(blogsController))
blogsRouter.get('/:id/posts', getPostsByBlogIdValidation, blogsController.getPostsForBlog.bind(blogsController))
blogsRouter.post('/:id/posts', createPostsByBlogIdValidation, blogsController.createPostForBlog.bind(blogsController))
blogsRouter.delete('/:id', deleteBlogValidation, blogsController.deleteBlog.bind(blogsController))