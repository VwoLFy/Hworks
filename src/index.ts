import express, { Request, Response } from 'express';
import { blogsRouter } from './routes/blogs-router';
import { postsRouter } from './routes/posts-router';
import { runDb } from './repositories/db';
import { blogsService } from './domain/blogs-service';
import { postsService } from './domain/posts-service';
import { blogsRoute, postsRoute, testing_all_dataRoute } from './routes/routes';
import { HTTP_Status } from './enums';

const app = express();
const bodyMiddleware = express.json();
const PORT = process.env.PORT || 5000;

app.use(bodyMiddleware);
app.use(blogsRoute, blogsRouter);
app.use(postsRoute, postsRouter);
app.get('/', (req, res) => {
  res.send('Hola! add tests for posts');
});

app.delete(testing_all_dataRoute, (req: Request, res: Response) => {
  blogsService.deleteAll();
  postsService.deleteAll();
  res.sendStatus(HTTP_Status.NO_CONTENT_204);
});

const startApp = async () => {
  await runDb();
  app.listen(PORT, () => {
    console.log(`Server listening ${PORT}`);
  });
};

startApp();

export default app;
