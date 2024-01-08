import express, { Request, Response } from 'express';
import { blogsRouter } from './routes/blogs-router';
import { postsRouter } from './routes/posts-router';
import { blogsRepository } from './repositories/blogs-repository';
import { postsRepository } from './repositories/posts-repository';
import { blogsRoute, postsRoute } from './routes/routes';

export const app = express();
const bodyMiddleware = express.json();
const PORT = process.env.PORT || 5000;

app.use(bodyMiddleware);
app.use(blogsRoute, blogsRouter);
app.use(postsRoute, postsRouter);
app.get('/', (req, res) => {
  res.send('Hola!');
});

app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepository.deleteAll();
  postsRepository.deleteAll();
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
