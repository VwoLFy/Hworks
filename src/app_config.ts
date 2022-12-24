import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {HTTP_Status} from "./types/enums";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routes/security-router";
import {AttemptsDataModel} from "./types/mongoose-schemas-models";
import {
    blogsService,
    commentsService,
    passRecoveryRepository,
    postsService,
    securityService,
    usersService
} from "./composition-root";

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
    await blogsService.deleteAll();
    await postsService.deleteAll();
    await usersService.deleteAll();
    await commentsService.deleteAll();
    await securityService.deleteAll();
    await passRecoveryRepository.deleteAll();
    await AttemptsDataModel.deleteMany();
    res.sendStatus(HTTP_Status.NO_CONTENT_204)
})
