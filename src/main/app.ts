import express, {Request, Response} from "express"
import {blogsRouter} from "../blogs/routes/blogs-router";
import {postsRouter} from "../posts/routes/posts-router";
import {usersRouter} from "../users/routes/users-router";
import {authRouter} from "../auth/routes/auth-router";
import {commentsRouter} from "../comments/routes/comments-router";
import {HTTP_Status} from "./types/enums";
import cookieParser from "cookie-parser";
import {securityRouter} from "../security/routes/security-router";
import {AttemptsDataModel} from "./types/mongoose-schemas-models";
import {
    blogsService,
    commentsService,
    postsService,
    securityService,
    usersService
} from "./composition-root";
import {PasswordRecoveryModel} from "../auth/types/mongoose-schemas-models";

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
    await PasswordRecoveryModel.deleteMany();
    await AttemptsDataModel.deleteMany();
    res.sendStatus(HTTP_Status.NO_CONTENT_204)
})