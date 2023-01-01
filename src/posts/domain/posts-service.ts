import {PostsRepository} from "../infrastructure/posts-repository";
import {CreatePostDtoType, PostClass, UpdatePostDto} from "../types/types";
import {BlogModel} from "../../blogs/types/mongoose-schemas-models";
import {PostHDType, PostModel} from "../types/mongoose-schemas-models";
import {inject, injectable} from "inversify";
import {CommentsRepository} from "../../comments/infrastructure/comments-repository";

@injectable()
export class PostsService{
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createPost(dto: CreatePostDtoType): Promise<string | null> {
        const {title, shortDescription, content, blogId} = dto
        const foundBlogName: string | null = await BlogModel.findBlogNameById(blogId)
        if (!foundBlogName) return null

        const newPost = new PostClass(title, shortDescription, content, blogId, foundBlogName)

        const post: PostHDType = new PostModel(newPost)
        await this.postsRepository.savePost(post)
        return post.id
    }
    async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post: PostHDType | null = await this.postsRepository.findPostById(id)
        if (!post) return false

        post.updatePost({...dto, blogName: foundBlogName})
        await this.postsRepository.savePost(post)
        return true
    }
    async deletePost(id: string): Promise<boolean> {
        const isDeletedPost = await this.postsRepository.deletePost(id)
        if (!isDeletedPost) return false

        await this.commentsRepository.deleteAllCommentsOfPost(id)
        return true
    }
    async deleteAll() {
        await this.postsRepository.deleteAll()
    }
}