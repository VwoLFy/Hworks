import request from 'supertest';
import { app } from '../../src';

import { HTTP_Status } from '../../src/enums';
import { blogsRoute, testing_all_dataRoute } from '../../src/routes/routes';
import { BlogInputModel, BlogViewModel } from '../../src/repositories/blogs-repository';
import { BadRequestError, testCheckBadRequestError } from './TestCheckBadRequestError';

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
    const result = await request(app).post(blogsRoute).auth('admin', 'qwerty').send(dto).expect(httpStatus);

    if (httpStatus !== HTTP_Status.BAD_REQUEST_400) return result.body;

    if (field) {
      const error: BadRequestError = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }
}

export default new HelpersForTests();
