import request from 'supertest';
import { app } from '../../src';

import { HTTP_Status } from '../../src/enums';
import { blogsRoute, testing_all_dataRoute } from '../../src/routes/routes';
import { BlogInputModel, BlogViewModel } from '../../src/repositories/blogs-repository';
import { testCheckBadRequestError } from './TestCheckBadRequestError';
import { BadRequestError } from '../../src/middlewares/input-validation-middleware';

class HelpersForTests {
  constructor() {}

  async deleteAllData() {
    await request(app).delete(testing_all_dataRoute).expect(HTTP_Status.NO_CONTENT_204);
  }

  async findBlogs(): Promise<BlogViewModel[]> {
    const result = await request(app).get(blogsRoute).expect(HTTP_Status.OK_200);
    return result.body;
  }

  async findBlog(blogId: string, httpStatus: HTTP_Status = HTTP_Status.OK_200): Promise<BlogViewModel | null> {
    const result = await request(app).get(`${blogsRoute}/${blogId}`).expect(httpStatus);
    return result.body ?? null;
  }

  async createBlog(
    dto: BlogInputModel,
    httpStatus: HTTP_Status = HTTP_Status.CREATED_201,
    field?: string | string[],
  ): Promise<BlogViewModel | null> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app).post(blogsRoute).auth('notadmin', 'qwerty').send(dto).expect(httpStatus);
      await request(app).post(blogsRoute).auth('admin', 'notqwerty').send(dto).expect(httpStatus);
      await request(app).post(blogsRoute).send(dto).expect(httpStatus);
      return null;
    }
    const result = await request(app).post(blogsRoute).auth('admin', 'qwerty').send(dto).expect(httpStatus);

    if (httpStatus === HTTP_Status.CREATED_201) return result.body;

    if (field) {
      const error: BadRequestError = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }
}

export default new HelpersForTests();
