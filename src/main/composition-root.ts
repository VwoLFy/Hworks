import "reflect-metadata";
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
import {Container} from "inversify";

export const container = new Container();

container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsQueryRepo).to(BlogsQueryRepo);
container.bind(BlogsRepository).to(BlogsRepository);

container.bind(PostController).to(PostController);
container.bind(PostsService).to(PostsService);
container.bind(PostsQueryRepo).to(PostsQueryRepo);
container.bind(PostsRepository).to(PostsRepository);

container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsQueryRepo).to(CommentsQueryRepo);
container.bind(CommentsRepository).to(CommentsRepository);

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);

container.bind(AuthController).to(AuthController);
container.bind(UsersQueryRepo).to(UsersQueryRepo);
container.bind(AuthService).to(AuthService);
container.bind(EmailManager).to(EmailManager);
container.bind(EmailAdapter).to(EmailAdapter);
container.bind(UsersRepository).to(UsersRepository);
container.bind(JwtService).to(JwtService);

container.bind(SecurityController).to(SecurityController);
container.bind(SecurityQueryRepo).to(SecurityQueryRepo);
container.bind(SecurityService).to(SecurityService);
container.bind(SecurityRepository).to(SecurityRepository);