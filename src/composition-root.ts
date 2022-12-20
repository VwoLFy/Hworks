import {SecurityRepository} from "./repositories/security-repository";
import {SecurityService} from "./domain/security-service";
import {SecurityQueryRepo} from "./repositories/security-queryRepo";
import {JwtService} from "./application/jwt-service";
import {UsersRepository} from "./repositories/users-repository";
import {EmailManager} from "./managers/email-manager";
import {PassRecoveryRepository} from "./repositories/pass-recovery-repository";
import {AuthService} from "./domain/auth-service";
import {UsersQueryRepo} from "./repositories/users-queryRepo";
import {SecurityController} from "./routes/security-controller";
import {AuthController} from "./routes/auth-controller";
import {UsersService} from "./domain/user-service";
import {UsersController} from "./routes/users-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsQueryRepo} from "./repositories/comments-queryRepo";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./routes/comments-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsQueryRepo} from "./repositories/posts-queryRepo";
import {PostsService} from "./domain/posts-service";
import {PostController} from "./routes/posts-controller";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsQueryRepo} from "./repositories/blogs-queryRepo";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routes/blogs-controller";
import {EmailAdapter} from "./adapters/email-adapter";

const securityRepository = new SecurityRepository()
export const securityService = new SecurityService(securityRepository)
const securityQueryRepo = new SecurityQueryRepo()
export const securityController = new SecurityController(securityQueryRepo, securityService)

export const jwtService = new JwtService(securityService)
const usersRepository = new UsersRepository()
const emailAdapter = new EmailAdapter()
const emailManager = new EmailManager(emailAdapter)
const passRecoveryRepository = new PassRecoveryRepository()
const authService = new AuthService(jwtService, usersRepository, emailManager, securityService, passRecoveryRepository)
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