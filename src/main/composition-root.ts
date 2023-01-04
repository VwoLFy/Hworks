import "reflect-metadata";
import {SecurityRepository} from "../security/infrastructure/security-repository";
import {SecurityService} from "../security/application/security-service";
import {SecurityQueryRepo} from "../security/infrastructure/security-queryRepo";
import {JwtService} from "../auth/application/jwt-service";
import {UsersRepository} from "../users/infrastructure/users-repository";
import {EmailManager} from "../auth/application/email-manager";
import {AuthService} from "../auth/application/auth-service";
import {UsersQueryRepo} from "../users/infrastructure/users-queryRepo";
import {SecurityController} from "../security/api/security-controller";
import {AuthController} from "../auth/api/auth-controller";
import {UsersService} from "../users/application/user-service";
import {UsersController} from "../users/api/users-controller";
import {CommentsRepository} from "../comments/infrastructure/comments-repository";
import {CommentsQueryRepo} from "../comments/infrastructure/comments-queryRepo";
import {CommentsService} from "../comments/application/comments-service";
import {CommentsController} from "../comments/api/comments-controller";
import {PostsRepository} from "../posts/infrastructure/posts-repository";
import {PostsQueryRepo} from "../posts/infrastructure/posts-queryRepo";
import {PostsService} from "../posts/application/posts-service";
import {PostController} from "../posts/api/posts-controller";
import {BlogsRepository} from "../blogs/infrastructure/blogs-repository";
import {BlogsQueryRepo} from "../blogs/infrastructure/blogs-queryRepo";
import {BlogsService} from "../blogs/application/blogs-service";
import {BlogsController} from "../blogs/api/blogs-controller";
import {EmailAdapter} from "../auth/infrastructure/email-adapter";
import {Container} from "inversify";
import {AttemptsRepository} from "../auth/infrastructure/attempts-repository";
import {AttemptsService} from "../auth/application/attempts-service";
import {PasswordRecoveryRepository} from "../auth/infrastructure/password-recovery-repository";

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

container.bind(AttemptsRepository).to(AttemptsRepository);
container.bind(AttemptsService).to(AttemptsService);

container.bind(PasswordRecoveryRepository).to(PasswordRecoveryRepository);