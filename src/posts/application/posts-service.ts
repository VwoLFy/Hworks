import {PostsRepository} from "../infrastructure/posts-repository";
import {CreatePostDTO, UpdatePostDTO} from "./dto";
import {BlogModel} from "../../blogs/domain/blog.schema";
import {Post, PostDocument, PostModel} from "../domain/post.schema";
import {inject, injectable} from "inversify";
import {CommentsRepository} from "../../comments/infrastructure/comments-repository";

@injectable()
export class PostsService{
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createPost(dto: CreatePostDTO): Promise<string | null> {
        const {title, shortDescription, content, blogId} = dto
        const foundBlogName: string | null = await BlogModel.findBlogNameById(blogId)
        if (!foundBlogName) return null

        const newPost = new Post(title, shortDescription, content, blogId, foundBlogName)

        const post: PostDocument = new PostModel(newPost)
        await this.postsRepository.savePost(post)
        return post.id
    }
    async updatePost(id: string, dto: UpdatePostDTO): Promise<boolean> {
        const foundBlogName: string | null = await BlogModel.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post: PostDocument | null = await this.postsRepository.findPostById(id)
        if (!post) return false

        post.updatePost(dto, foundBlogName)
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