import {PostsRepository} from "../infrastructure/posts-repository";
import {UpdatePostDto} from "./dto/UpdatePostDto";
import {Post, PostModel} from "../domain/post.schema";
import {inject, injectable} from "inversify";
import {CommentsRepository} from "../../comments/infrastructure/comments-repository";
import {CreatePostDto} from "./dto/CreatePostDto";
import {BlogsRepository} from "../../blogs/infrastructure/blogs-repository";
import {LikePostDto} from "./dto/LikePostDto";
import {UsersRepository} from "../../users/infrastructure/users-repository";

@injectable()
export class PostsService{
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {}

    async createPost(dto: CreatePostDto): Promise<string | null> {
        const {title, shortDescription, content, blogId} = dto

        const foundBlogName = await this.blogsRepository.findBlogNameById(blogId)
        if (!foundBlogName) return null

        const newPost = new Post(title, shortDescription, content, blogId, foundBlogName)

        const post = new PostModel(newPost)
        await this.postsRepository.savePost(post)
        return post.id
    }
    async updatePost(id: string, dto: UpdatePostDto): Promise<boolean> {
        const foundBlogName = await this.blogsRepository.findBlogNameById(dto.blogId)
        if (!foundBlogName) return false

        const post = await this.postsRepository.findPostById(id)
        if (!post) return false

        post.updatePost(dto, foundBlogName)
        await this.postsRepository.savePost(post)
        return true
    }
    async likePost(dto: LikePostDto): Promise<boolean> {
        const {postId, userId, likeStatus} = dto

        const foundPost = await this.postsRepository.findPostById(postId)
        if (!foundPost) return false

        const userLogin = await this.usersRepository.findUserLoginById(userId)
        if (!userLogin) return false

        const foundLike =  await this.postsRepository.findPostLike(postId, userId)

        const like = foundPost.setLikeStatus(foundLike, userId, userLogin, likeStatus)
        await this.postsRepository.savePost(foundPost)
        await this.postsRepository.savePostLike(like)

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