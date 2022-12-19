import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {usersRouter} from "./routes/users-router";
import {UsersService} from "./domain/user-service";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {CommentsService} from "./domain/comments-service";
import {HTTP_Status} from "./types/enums";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routes/security-router";
import {SecurityService} from "./domain/security-service";
import {PassRecoveryRepository} from "./repositories/pass-recovery-repository";
import {AttemptsDataModel} from "./types/mongoose-schemas-models";

export const app = express();
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
    await new BlogsService().deleteAll();
    await new PostsService().deleteAll();
    await new UsersService().deleteAll();
    await new CommentsService().deleteAll();
    await new SecurityService().deleteAll();
    await AttemptsDataModel.deleteMany();
    await new PassRecoveryRepository().deleteAll();
    res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
