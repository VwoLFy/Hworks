import {SecurityRepository} from "../security/repositories/security-repository";
import {SecurityService} from "../security/domain/security-service";
import {SecurityQueryRepo} from "../security/repositories/security-queryRepo";
import {JwtService} from "../auth/application/jwt-service";
import {UsersRepository} from "../users/repositories/users-repository";
import {EmailManager} from "../auth/managers/email-manager";
import {AuthService} from "../auth/domain/auth-service";
import {UsersQueryRepo} from "../users/repositories/users-queryRepo";
import {SecurityController} from "../security/routes/security-controller";
import {AuthController} from "../auth/routes/auth-controller";
import {UsersService} from "../users/domain/user-service";
import {UsersController} from "../users/routes/users-controller";
import {CommentsRepository} from "../comments/repositories/comments-repository";
import {CommentsQueryRepo} from "../comments/repositories/comments-queryRepo";
import {CommentsService} from "../comments/domain/comments-service";
import {CommentsController} from "../comments/routes/comments-controller";
import {PostsRepository} from "../posts/repositories/posts-repository";
import {PostsQueryRepo} from "../posts/repositories/posts-queryRepo";
import {PostsService} from "../posts/domain/posts-service";
import {PostController} from "../posts/routes/posts-controller";
import {BlogsRepository} from "../blogs/repositories/blogs-repository";
import {BlogsQueryRepo} from "../blogs/repositories/blogs-queryRepo";
import {BlogsService} from "../blogs/domain/blogs-service";
import {BlogsController} from "../blogs/routes/blogs-controller";
import {EmailAdapter} from "../auth/adapters/email-adapter";

const securityRepository = new SecurityRepository()
export const securityService = new SecurityService(securityRepository)
const securityQueryRepo = new SecurityQueryRepo()
export const securityController = new SecurityController(securityQueryRepo, securityService)

export const jwtService = new JwtService(securityService)
const usersRepository = new UsersRepository()
const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(emailAdapter)
const authService = new AuthService(jwtService, usersRepository, emailManager, securityService)
const usersQueryRepo = new UsersQueryRepo()
export const authController = new AuthController(authService, jwtService, usersQueryRepo)

export const usersService = new UsersService(usersRepository)
export const usersController = new UsersController(usersQueryRepo, usersService)

const commentsRepository = new CommentsRepository()
const commentsQueryRepo = new CommentsQueryRepo()
export const commentsService = new CommentsService(usersRepository, commentsRepository)
export const commentsController = new CommentsController(commentsQueryRepo, commentsService)

const postsRepository = new PostsRepository()
const postsQueryRepo = new PostsQueryRepo()
export const postsService = new PostsService(postsRepository)
export const postController = new PostController(postsQueryRepo, postsService, commentsQueryRepo, commentsService)

const blogsRepository = new BlogsRepository()
const blogsQueryRepo = new BlogsQueryRepo()
export const blogsService = new BlogsService(blogsRepository, postsRepository)

export const blogsController = new BlogsController(blogsQueryRepo, blogsService,postsQueryRepo, postsService)