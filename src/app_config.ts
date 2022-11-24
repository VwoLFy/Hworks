import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {blogsService} from "./domain/blogs-service";
import {postsService} from "./domain/posts-service";
import {usersRouter} from "./routes/users-router";
import {usersService} from "./domain/user-service";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {commentsService} from "./domain/comments-service";
import {HTTP_Status} from "./types/enums";
import cookieParser from "cookie-parser";

export const app = express();
const bodyMiddle = express.json();

app.use(cookieParser())
app.use(bodyMiddle);
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsService.deleteAll();
    await postsService.deleteAll();
    await usersService.deleteAll();
    await commentsService.deleteAll();
    res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
