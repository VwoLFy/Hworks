import request from "supertest";

import { testCheckBadRequestError } from "./TestCheckBadRequestError";
import app from "../../src/main/app";
import {
  blogsRoute,
  postsRoute,
  testing_all_dataRoute,
} from "../../src/main/routes/routes";
import { HTTP_Status } from "../../src/main/types/enums";
import { BlogViewModel } from "../../src/blogs/api/models/BlogViewModel";
import { CreateBlogDto } from "../../src/blogs/application/dto/CreateBlogDto";
import { ErrorResultType } from "../../src/main/middlewares/input-validation-middleware";
import { UpdateBlogDto } from "../../src/blogs/application/dto/UpdateBlogDto";
import { PostViewModel } from "../../src/posts/api/models/PostViewModel";
import { CreatePostDto } from "../../src/posts/application/dto/CreatePostDto";
import { UpdatePostDto } from "../../src/posts/application/dto/UpdatePostDto";

class HelpersForTests {
  constructor() {}

  async deleteAllData() {
    await request(app)
      .delete(testing_all_dataRoute)
      .expect(HTTP_Status.NO_CONTENT_204);
  }

  async findBlogs(query: string = ''): Promise<BlogViewModel[]> {
    const result = await request(app)
      .get(blogsRoute + query)
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async findBlogById(
    blogId: string,
    httpStatus: HTTP_Status = HTTP_Status.OK_200,
  ): Promise<BlogViewModel | null> {
    const result = await request(app)
      .get(`${blogsRoute}/${blogId}`)
      .expect(httpStatus);
    return result.body ?? null;
  }

  async createBlog(
    dto: CreateBlogDto,
    httpStatus: HTTP_Status = HTTP_Status.CREATED_201,
    field?: string | string[],
  ): Promise<BlogViewModel | null> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .post(blogsRoute)
        .auth("not_admin", "qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .post(blogsRoute)
        .auth("admin", "not_qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app).post(blogsRoute).send(dto).expect(httpStatus);
      return null;
    }
    const result = await request(app)
      .post(blogsRoute)
      .auth("admin", "qwerty")
      .send(dto)
      .expect(httpStatus);

    if (httpStatus === HTTP_Status.CREATED_201) return result.body;

    if (HTTP_Status.BAD_REQUEST_400 && field) {
      const error: ErrorResultType = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }

  async updateBlog(
    blogId: string,
    dto: UpdateBlogDto,
    httpStatus: HTTP_Status = HTTP_Status.NO_CONTENT_204,
    field?: string | string[],
  ): Promise<BlogViewModel | null> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .put(`${blogsRoute}/${blogId}`)
        .auth("not_admin", "qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .put(`${blogsRoute}/${blogId}`)
        .auth("admin", "not_qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .put(`${blogsRoute}/${blogId}`)
        .send(dto)
        .expect(httpStatus);
      return null;
    }
    const result = await request(app)
      .put(`${blogsRoute}/${blogId}`)
      .auth("admin", "qwerty")
      .send(dto)
      .expect(httpStatus);

    if (httpStatus === HTTP_Status.NO_CONTENT_204) return result.body;

    if (HTTP_Status.BAD_REQUEST_400 && field) {
      const error: ErrorResultType = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }

  async deleteBlog(
    blogId: string,
    httpStatus: HTTP_Status = HTTP_Status.NO_CONTENT_204,
  ): Promise<void> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .delete(`${blogsRoute}/${blogId}`)
        .auth("not_admin", "qwerty")
        .expect(httpStatus);
      await request(app)
        .delete(`${blogsRoute}/${blogId}`)
        .auth("admin", "not_qwerty")
        .expect(httpStatus);
      await request(app).delete(`${blogsRoute}/${blogId}`).expect(httpStatus);
    } else {
      await request(app)
        .delete(`${blogsRoute}/${blogId}`)
        .auth("admin", "qwerty")
        .expect(httpStatus);
    }
    return;
  }

  async findPosts(): Promise<PostViewModel[]> {
    const result = await request(app)
      .get(postsRoute)
      .expect(HTTP_Status.OK_200);
    return result.body;
  }

  async findPostById(
    postId: string,
    httpStatus: HTTP_Status = HTTP_Status.OK_200,
  ): Promise<PostViewModel | null> {
    const result = await request(app)
      .get(`${postsRoute}/${postId}`)
      .expect(httpStatus);
    return result.body ?? null;
  }

  async createPost(
    dto: CreatePostDto,
    httpStatus: HTTP_Status = HTTP_Status.CREATED_201,
    field?: string | string[],
  ): Promise<PostViewModel | null> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .post(postsRoute)
        .auth("not_admin", "qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .post(postsRoute)
        .auth("admin", "not_qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app).post(postsRoute).send(dto).expect(httpStatus);
      return null;
    }
    const result = await request(app)
      .post(postsRoute)
      .auth("admin", "qwerty")
      .send(dto)
      .expect(httpStatus);

    if (httpStatus === HTTP_Status.CREATED_201) return result.body;

    if (HTTP_Status.BAD_REQUEST_400 && field) {
      const error: ErrorResultType = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }

  async updatePost(
    postId: string,
    dto: UpdatePostDto,
    httpStatus: HTTP_Status = HTTP_Status.NO_CONTENT_204,
    field?: string | string[],
  ): Promise<PostViewModel | null> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .put(`${postsRoute}/${postId}`)
        .auth("not_admin", "qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .put(`${postsRoute}/${postId}`)
        .auth("admin", "not_qwerty")
        .send(dto)
        .expect(httpStatus);
      await request(app)
        .put(`${postsRoute}/${postId}`)
        .send(dto)
        .expect(httpStatus);
      return null;
    }
    const result = await request(app)
      .put(`${postsRoute}/${postId}`)
      .auth("admin", "qwerty")
      .send(dto)
      .expect(httpStatus);

    if (httpStatus === HTTP_Status.NO_CONTENT_204) return result.body;

    if (HTTP_Status.BAD_REQUEST_400 && field) {
      const error: ErrorResultType = result.body;
      testCheckBadRequestError(error, field);
    }
    return null;
  }

  async deletePost(
    postId: string,
    httpStatus: HTTP_Status = HTTP_Status.NO_CONTENT_204,
  ): Promise<void> {
    if (httpStatus === HTTP_Status.UNAUTHORIZED_401) {
      await request(app)
        .delete(`${postsRoute}/${postId}`)
        .auth("not_admin", "qwerty")
        .expect(httpStatus);
      await request(app)
        .delete(`${postsRoute}/${postId}`)
        .auth("admin", "not_qwerty")
        .expect(httpStatus);
      await request(app).delete(`${postsRoute}/${postId}`).expect(httpStatus);
    } else {
      await request(app)
        .delete(`${postsRoute}/${postId}`)
        .auth("admin", "qwerty")
        .expect(httpStatus);
    }
    return;
  }
}

export default new HelpersForTests();
