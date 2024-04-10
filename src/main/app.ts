import express, {Request, Response} from "express"
import {blogsRouter} from "../blogs/api/blogs-router";
import {postsRouter} from "../posts/api/posts-router";
import {usersRouter} from "../users/api/users-router";
import {authRouter} from "../auth/api/auth-router";
import {commentsRouter} from "../comments/api/comments-router";
import {HTTP_Status} from "./types/enums";
import cookieParser from "cookie-parser";
import {securityRouter} from "../security/api/security-router";
import {container} from "./composition-root";
import {BlogsService} from "../blogs/application/blogs-service";
import {PostsService} from "../posts/application/posts-service";
import {UsersService} from "../users/application/user-service";
import {CommentsService} from "../comments/application/comments-service";
import {SecurityService} from "../security/application/security-service";
import {AttemptsService} from "../auth/application/attempts-service";
import {PasswordRecoveryRepository} from "../auth/infrastructure/password-recovery-repository";

const app = express();
const bodyMiddle = express.json();

app.set('trust proxy', true)
app.use(cookieParser())
app.use(bodyMiddle);
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await container.resolve(BlogsService).deleteAll();
    await container.resolve(PostsService).deleteAll();
    await container.resolve(UsersService).deleteAll();
    await container.resolve(CommentsService).deleteAll();
    await container.resolve(SecurityService).deleteAll();
    await container.resolve(PasswordRecoveryRepository).deleteAll();
    await container.resolve(AttemptsService).deleteAll();
    res.sendStatus(HTTP_Status.NO_CONTENT_204)
})

export default app