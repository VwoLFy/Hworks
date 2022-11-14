import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {blogsService} from "./domain/blogs-service";
import {postsService} from "./domain/posts-service";
import {usersRouter} from "./routes/users-router";
import {usersService} from "./domain/user-service";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {commentsService} from "./domain/comments-service";

export const app = express();
const bodyMiddle = express.json();
const PORT = process.env.PORT || 5000;

app.use(bodyMiddle);
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsService.deleteAll();
    postsService.deleteAll();
    usersService.deleteAll();
    commentsService.deleteAll();
    res.sendStatus(204)
})

const startApp = async () => {
    await runDb();
    app.listen(PORT, () => {
        console.log(`Server listening ${PORT}`)
    })
}

startApp()