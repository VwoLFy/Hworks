import express, {Request, Response} from "express"
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {blogsRepository} from "./repositories/blogs-repository";
import {postsRepository} from "./repositories/posts-repository";
import {runDb} from "./repositories/db";

const app = express();
const bodyMidlle = express.json();
const PORT = process.env.PORT || 5000;

app.use(bodyMidlle);
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogsRepository.deleteAll();
    postsRepository.deleteAll();
    res.sendStatus(204)
})

const startApp = async () => {
    await runDb();
    app.listen(PORT, () => {
        console.log(`Server listening ${PORT}`)
    })
}

startApp()