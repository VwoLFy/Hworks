import request from "supertest"
import {BlogViewModel} from "../../src/blogs/api/models/BlogViewModel";
import {PostViewModel} from "../../src/posts/api/models/PostViewModel";
import {UserViewModel} from "../../src/users/api/models/UserViewModel";
import {LoginSuccessViewModel} from "../../src/auth/api/models/LoginSuccessViewModel";
import {CommentViewModel} from "../../src/comments/api/models/CommentViewModel";
import {ErrorResultType} from "../../src/main/middlewares/input-validation-middleware";
import app from "../../src/main/app";
import {HTTP_Status, LikeStatus} from "../../src/main/types/enums";
import {DeviceViewModel} from "../../src/security/api/models/DeviceViewModel";
import mongoose from "mongoose";
import {runDb} from "../../src/main/db";

const checkError = (apiErrorResult: ErrorResultType, field: string) => {
    expect(apiErrorResult).toEqual({
        errorsMessages: [
            {
                message: expect.any(String),
                field: field
            }
        ]
    })
}
const delay = async (delay: number = 1000) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve('');
        }, delay);
    });
}

describe('Test of the Homework', () => {
    beforeAll(async () => {
        await runDb()
    })
    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('/blogs', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let blog1: BlogViewModel
        let blog2: BlogViewModel
        it('GET should return 200', async function () {
            await request(app)
                .get('/blogs')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        });
        it('POST shouldn`t create blog with incorrect "data"', async () => {
            await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "    ",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "valid name",
                    description: "description",
                    websiteUrl: " htt://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "valid name",
                    description: "        ",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "valid name",
                    description: "a".repeat(501),
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.BAD_REQUEST_400)

            await request(app)
                .get('/blogs')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
        it('POST should create blog with correct data', async () => {
            const result = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: " NEW NAME   ",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            blog1 = result.body

            expect(blog1).toEqual(
                {
                    id: expect.any(String),
                    name: "NEW NAME",
                    description: "description",
                    websiteUrl: "https://localhost1.uuu/blogs",
                    createdAt: expect.any(String)
                }
            )
            await request(app)
                .get('/blogs')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [blog1]
                })
        })
        it('PUT shouldn`t update blog with incorrect data', async () => {
            await request(app).put(`/blogs/${blog1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "    ",
                    description: "Updating description",
                    websiteUrl: "https://api-swagger.it-incubator.ru/"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app).put(`/blogs/${blog1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "valid name",
                    description: "Updating description",
                    websiteUrl: "http://api-swagger.it-incubator"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app).put(`/blogs/1`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: " Updating NAME   ",
                    description: "Updating description",
                    websiteUrl: "https://api-swagger.it-incubator.ru/"
                })
                .expect(HTTP_Status.NOT_FOUND_404)
        })
        it('PUT should update blog with correct data', async () => {
            await request(app).put(`/blogs/${blog1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: " Updating NAME   ",
                    description: "Updating description",
                    websiteUrl: "https://api-swagger.it-incubator.ru/"
                })
                .expect(HTTP_Status.NO_CONTENT_204)
            const result = await request(app)
                .get(`/blogs/${blog1.id}`)
                .expect(HTTP_Status.OK_200)
            blog2 = result.body

            expect(blog2).toEqual(
                {
                    id: expect.any(String),
                    name: "Updating NAME",
                    description: "Updating description",
                    websiteUrl: "https://api-swagger.it-incubator.ru/",
                    createdAt: expect.any(String)
                })
            expect(blog2).not.toEqual(blog1)
        })
        it('DELETE shouldn`t delete blog with incorrect "id"', async () => {
            await request(app).delete(`/blogs/1`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NOT_FOUND_404)

            await request(app)
                .get(`/blogs/${blog1.id}`)
                .expect(HTTP_Status.OK_200, blog2)
        })
        it('DELETE should delete blog with correct "id"', async () => {
            await request(app).delete(`/blogs/${blog1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .get('/blogs')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
    })
    describe('/posts', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let post1: PostViewModel
        let post2: PostViewModel
        let post3: PostViewModel
        let blog1: BlogViewModel
        it('GET should return 200', async function () {
            await request(app)
                .get('/posts')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        });
        it('GET By Id should return 404', async function () {
            await request(app)
                .get('/posts/1')
                .expect(HTTP_Status.NOT_FOUND_404)

        });
        it('POST shouldn`t create post with incorrect data', async () => {
            const result = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "blogName",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            blog1 = result.body

            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "",
                    content: "valid",
                    blogId: `${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3mWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "",
                    blogId: `${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `1`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog1.id}`,
                    shortDescription: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)

            await request(app)
                .get('/posts')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
        it('POST should create post with correct data', async () => {
            const result = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post1 = result.body

            expect(post1).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog1.id}`,
                    blogName: `${blog1.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LikeStatus.None,
                        newestLikes: []
                    }
                }
            )
            await request(app)
                .get('/posts')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [post1]
                })
        })
        it('PUT shouldn`t update blog with incorrect "name"', async () => {

            await request(app)
                .put(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "",
                    content: "valid",
                    blogId: `${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "",
                    blogId: `/posts/${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `/posts/1`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `/posts/${blog1.id}`,
                    shortDescription: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/posts/1`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `/posts/${blog1.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
        })
        it('PUT should update blog with correct data', async () => {
            await request(app).put(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "Update POST",
                    shortDescription: "Update shortDescription",
                    content: "Update content",
                    blogId: `${blog1.id}`
                })
                .expect(HTTP_Status.NO_CONTENT_204)
            const result = await request(app)
                .get(`/posts/${post1.id}`)
                .expect(HTTP_Status.OK_200)
            post2 = result.body
            expect(post2).toEqual(
                {
                    id: expect.any(String),
                    title: "Update POST",
                    content: "Update content",
                    blogId: `${blog1.id}`,
                    blogName: `${blog1.name}`,
                    shortDescription: "Update shortDescription",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LikeStatus.None,
                        newestLikes: []
                    }
                })
            expect(post2).not.toEqual(post1)
        })
        it('GET all posts for bad blog should return 404', async function () {
            await request(app)
                .get(`/blogs/1/posts`)
                .expect(HTTP_Status.NOT_FOUND_404)

        });
        it('POST should create post for new blog', async () => {
            const resultBlog = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "blogName",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            const blog2 = resultBlog.body

            const resultPost = await request(app)
                .post(`/blogs/${blog2.id}/posts`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog2.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post3 = resultPost.body

            expect(post3.blogId).toBe(blog2.id)
        })
        it('GET all posts for specific blog should return 200', async function () {
            const result = await request(app)
                .get(`/blogs/${blog1.id}/posts`)
                .expect(HTTP_Status.OK_200)
            const result2 = await request(app)
                .get(`/blogs/${blog1.id}/posts`)
                .expect(HTTP_Status.OK_200)

            expect(result.body.items.length).toBe(1)
            expect(result2.body.items.length).toBe(1)
        });
        it('GET2 should return 200', async function () {
            await request(app)
                .get('/posts')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [post3, post2]
                })
        });

        it('DELETE shouldn`t delete blog with incorrect "id"', async () => {
            await request(app).delete(`/posts/1`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NOT_FOUND_404)

            await request(app)
                .get(`/posts/${post1.id}`)
                .expect(HTTP_Status.OK_200, post2)
        })
        it('DELETE should delete blog with correct "id"', async () => {
            await request(app).delete(`/posts/${post1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .get('/posts')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [post3]
                })
        })
        it('DELETE blog should delete all posts of this blog', async () => {
            const result1 = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid1",
                    content: "valid1",
                    blogId: `${blog1.id}`,
                    shortDescription: "1 K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post1 = result1.body

            const result2 = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid2",
                    content: "valid2",
                    blogId: `${blog1.id}`,
                    shortDescription: "2 K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post2 = result2.body

            await request(app).delete(`/blogs/${blog1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .get(`/blogs/${blog1.id}`)
                .expect(HTTP_Status.NOT_FOUND_404)
            await request(app)
                .get(`/blogs/${blog1.id}/posts`)
                .expect(HTTP_Status.NOT_FOUND_404)
            await request(app)
                .get(`/posts/${post1.id}`)
                .expect(HTTP_Status.NOT_FOUND_404)
            await request(app)
                .get(`/posts/${post2.id}`)
                .expect(HTTP_Status.NOT_FOUND_404)
        })
    })
    describe('/users', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let user1: UserViewModel
        it('GET should return 200', async function () {
            await request(app)
                .get('/users')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        });
        it('POST shouldn`t create user with incorrect data', async () => {
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string12345.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)

            await request(app)
                .get('/users')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
        it('POST should create user with correct data', async () => {
            const result = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user1 = result.body

            expect(user1).toEqual(
                {
                    id: expect.any(String),
                    login: "login",
                    email: "string2@sdf.ee",
                    createdAt: expect.any(String)
                }
            )
            await request(app)
                .get('/users')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [user1]
                })
        })
        it('POST shouldn`t create user with existed login', async () => {
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "1string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "Login",
                    password: "password",
                    email: "2string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "LOGIN",
                    password: "password",
                    email: "3string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)

        })
        it('POST shouldn`t create user with existed email', async () => {
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "1login",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "2login",
                    password: "password",
                    email: "STRING2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "3login",
                    password: "password",
                    email: "String2@sdf.ee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "3login",
                    password: "password",
                    email: "string2@sdf.EE"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
        })
        it('DELETE shouldn`t delete blog with incorrect "id"', async () => {
            await request(app).delete(`/users/1`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NOT_FOUND_404)
        })
        it('DELETE should delete blog with correct "id"', async () => {
            await request(app).delete(`/users/${user1.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .get('/users')
                .expect(HTTP_Status.OK_200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
        })
    })
    describe('/auth', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let user: UserViewModel
        let validAccessToken: LoginSuccessViewModel, oldAccessToken: LoginSuccessViewModel
        let refreshTokenKey: string, validRefreshToken: string, oldRefreshToken: string
        it('POST shouldn`t authenticate user with incorrect data', async () => {
            const result = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user = result.body
            await request(app)
                .post('/auth/login')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    loginOrEmail: "login",
                    password: "password3",
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    loginOrEmail: "",
                    password: "password",
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            // await request(app)
            //     .post('/auth/login')
            //     .auth('admin', 'qwerty', {type: 'basic'})
            //     .send({
            //         loginOrEmail: "login",
            //         password: "",
            //     })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/login')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    loginOrEmail: "string2@sdf.eee",
                    password: "password",
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
        })
        it('POST should authenticate user with correct login; content: AccessToken, RefreshToken in cookie (http only, secure)', async () => {
            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)

            await delay()
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(result.headers['set-cookie'][0].includes('HttpOnly')).toBe(true)
            expect(result.headers['set-cookie'][0].includes('Secure')).toBe(true)

        })
        it('GET shouldn`t get data about user by bad token', async () => {
            await request(app)
                .get('/auth/me')
                .auth(validAccessToken.accessToken + 'd', {type: "bearer"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .get('/auth/me')
                .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzcxMzkzNTQ5OTYxNWM1MTAwZGM5YjQiLCJpYXQiOjE2NjgzNjU0MDUsImV4cCI6MTY3NTAxODIwNX0.Mb02J2SwIzjfXVX0RIihvR1ioj-rcP0fVt3TQcY-BlY', {type: "bearer"})
                .expect(HTTP_Status.UNAUTHORIZED_401)

            await request(app)
                .get('/auth/me')
                .expect(HTTP_Status.UNAUTHORIZED_401)
        })
        it('GET should get data about user by token', async () => {
            await request(app)
                .get('/auth/me')
                .auth(validAccessToken.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)
        })
/*
        it('GET shouldn`t get data about user when the AccessToken has expired', async () => {
            await delay(10000);

            await request(app)
                .get('/auth/me')
                .auth(validAccessToken.accessToken, {type: "bearer"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
        }, 15000)
        it('POST should return an error when the "refresh" token has expired or there is no one in the cookie', async () => {
            await request(app)
                .post('/auth/refresh-token')
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", ``)
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${validRefreshToken}1`)
                .expect(HTTP_Status.UNAUTHORIZED_401)

            await delay(10000)
            await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
        }, 15000);
       */
        it('POST should authenticate user with correct email', async () => {
            //await delay(10000);
            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "string2@sdf.ee",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)

            await delay()
            oldAccessToken = validAccessToken
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})
            expect(validAccessToken).not.toEqual(oldAccessToken)

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            oldRefreshToken = validRefreshToken;
            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(oldRefreshToken).not.toEqual(validRefreshToken)

        }, 15000)
        it('POST should return new tokens; content: AccessToken, RefreshToken in cookie (http only, secure)', async () => {
            const result = await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)
            //.expect('set-cookie', `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure`)

            await delay()
            oldAccessToken = validAccessToken
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})
            expect(validAccessToken).not.toEqual(oldAccessToken)

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            oldRefreshToken = validRefreshToken;
            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(oldRefreshToken).not.toEqual(validRefreshToken)
            expect(result.headers['set-cookie'][0].includes('HttpOnly')).toBe(true)
            expect(result.headers['set-cookie'][0].includes('Secure')).toBe(true)

        });
        it('POST shouldn`t return new tokens when "refresh" token in BL', async () => {
            await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${oldRefreshToken}`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('POST should return new tokens 2', async () => {
            const result = await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            await delay()
            oldAccessToken = validAccessToken
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})
            expect(validAccessToken).not.toEqual(oldAccessToken)

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            oldRefreshToken = validRefreshToken;
            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(oldRefreshToken).not.toEqual(validRefreshToken)

        });
        it('POST shouldn`t logout user when "refresh" token in BL', async () => {
            await request(app)
                .post('/auth/logout')
                .set("Cookie", `refreshToken=${oldRefreshToken}`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('POST should logout user', async () => {
            const result = await request(app)
                .post('/auth/logout')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.NO_CONTENT_204)

            await delay()
            oldAccessToken = validAccessToken
            validAccessToken = result.body
            expect(validAccessToken).toEqual({})
            expect(validAccessToken).not.toEqual(oldAccessToken)

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            oldRefreshToken = validRefreshToken;
            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(validRefreshToken).toBe('')

        });
        it('POST shouldn`t logout user', async () => {
            await request(app)
                .post('/auth/logout')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });

    })
    describe('comments from post or /comments', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let token: LoginSuccessViewModel
        let user: UserViewModel
        let comment: CommentViewModel
        let post: PostViewModel
        let blog: BlogViewModel
        let user2: UserViewModel
        let token2: LoginSuccessViewModel
        it('POST shouldn`t create comment with incorrect data', async () => {
            const resultBlog = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "blogName",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            blog = resultBlog.body

            const resultPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post = resultPost.body

            const resultUser = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user = resultUser.body

            const resultToken = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)
            token = resultToken.body

            await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken + 'd', {type: "bearer"})
                .send({content: "valid comment111111111"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
            let result = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "bad content"})
                .expect(HTTP_Status.BAD_REQUEST_400)
            checkError(result.body, "content")

            result = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "bad content11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222"})
                .expect(HTTP_Status.BAD_REQUEST_400)
            checkError(result.body, "content")

            await request(app)
                .post(`/posts/63189b06003380064c4193be/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "valid comment111111111"})
                .expect(HTTP_Status.NOT_FOUND_404)
        })
        it('GET comments should return 404', async () => {
            await request(app)
                .get(`/posts/${post.id}/comments`)
                .expect(HTTP_Status.NOT_FOUND_404)
        })
        it('POST should create comment with correct data', async () => {
            const result = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment111111111"
                })
                .expect(HTTP_Status.CREATED_201)
            comment = result.body
            expect(comment).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment111111111",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                }
            )
        })
        it('GET should return 200 and comments', async () => {
            await request(app)
                .get(`/posts/${post.id}/comments`)
                .expect(HTTP_Status.OK_200, {
                        pagesCount: 1,
                        page: 1,
                        pageSize: 10,
                        totalCount: 1,
                        items: [{
                            id: comment.id,
                            content: comment.content,
                            userId: comment.userId,
                            userLogin: comment.userLogin,
                            createdAt: comment.createdAt,
                            likesInfo: {
                                "likesCount": 0,
                                "dislikesCount": 0,
                                "myStatus": "None"
                            }
                        }]
                    }
                )
        })
        it('GET should return 200 and found comment by id ', async () => {
            await request(app)
                .get(`/comments/${comment.id}`)
                .expect(HTTP_Status.OK_200, {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                })
        });
        it('GET should return 404', async () => {
            await request(app)
                .get(`/comments/1`)
                .expect(HTTP_Status.NOT_FOUND_404)
        });
        it('PUT shouldn`t update comment and return 400', async () => {
            await request(app)
                .put(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "bad content"})
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "bad content111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"})
                .expect(HTTP_Status.BAD_REQUEST_400)
        });
        it('PUT shouldn`t update comment and return 401', async () => {
            await request(app)
                .put(`/comments/${comment.id}`)
                .auth(token.accessToken + 'd', {type: "bearer"})
                .send({content: "new content"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('PUT shouldn`t update comment and return 404', async () => {
            await request(app)
                .put(`/comments/1`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "new content!!!!!!!!!!!"})
                .expect(HTTP_Status.NOT_FOUND_404)
        });
        it('PUT shouldn`t update comment and return 403', async () => {
            const resultUser = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: "basic"})
                .send({
                    login: 'login2',
                    password: 'password2',
                    email: "email@mail.com"
                })
                .expect(HTTP_Status.CREATED_201)
            user2 = resultUser.body
            const resultToken = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: 'login2',
                    password: 'password2'
                })
                .expect(HTTP_Status.OK_200)
            token2 = resultToken.body

            await request(app)
                .put(`/comments/${comment.id}`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({content: "new content_new content"})
                .expect(HTTP_Status.FORBIDDEN_403)
        });
        it('PUT should update comment', async () => {
            await request(app)
                .put(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .send({content: "new content_new content"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const newComment = await request(app)
                .get(`/comments/${comment.id}`)
                .expect(HTTP_Status.OK_200)

            expect(comment).not.toEqual(newComment.body)
            expect(newComment.body.content).toBe('new content_new content')
            expect(comment.content).not.toBe('new content_new content')
        });
        it('DELETE shouldn`t delete comment and return 401', async () => {
            await request(app)
                .delete(`/comments/${comment.id}`)
                .auth(token.accessToken + 'd', {type: "bearer"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('DELETE shouldn`t delete comment and return 404', async () => {
            await request(app)
                .delete(`/comments/1`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.NOT_FOUND_404)
        });
        it('DELETE shouldn`t delete comment and return 403', async () => {
            await request(app)
                .delete(`/comments/${comment.id}`)
                .auth(token2.accessToken, {type: "bearer"})
                .expect(HTTP_Status.FORBIDDEN_403)
        });
        it('DELETE should delete comment', async () => {
            await request(app)
                .delete(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .get(`/comments/${comment.id}`)
                .expect(HTTP_Status.NOT_FOUND_404)
        });
    })
    describe('/security', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let user: UserViewModel
        let validAccessToken: LoginSuccessViewModel
        let refreshTokenKey: string, validRefreshToken: string, oldRefreshToken: string, validRefreshToken0: string
        let devices: DeviceViewModel[]
        it('POST should authenticate user with correct data', async () => {
            const resultUser = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)

            user = resultUser.body

            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)

            await delay()
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            [refreshTokenKey, validRefreshToken0] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(result.headers['set-cookie'][0].includes('HttpOnly')).toBe(true)
            expect(result.headers['set-cookie'][0].includes('Secure')).toBe(true)

        })
        it('GET should get data about user by token', async () => {
            await request(app)
                .get('/auth/me')
                .auth(validAccessToken.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)
        })
        it('POST should authenticate user +2 times', async () => {
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)
            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)

            await delay()
            validAccessToken = result.body
            expect(validAccessToken).toEqual({accessToken: expect.any(String)})

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(result.headers['set-cookie'][0].includes('HttpOnly')).toBe(true)
            expect(result.headers['set-cookie'][0].includes('Secure')).toBe(true)

        })
        it('GET should get device list', async () => {
            const result = await request(app)
                .get('/security/devices')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            devices = result.body
            expect(devices).toEqual([
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }])
        })
        it('DELETE should return error if Id param not found', async () => {
            await request(app)
                .delete('/security/devices/someId')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.NOT_FOUND_404)
        })
        it('DELETE should return error if auth credentials is incorrect', async () => {
            await request(app)
                .delete(`/security/devices/${devices[0].deviceId}`)
                .set("Cookie", `refreshToken=${validRefreshToken}+1`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .delete(`/security/devices/${devices[0].deviceId}`)
                .expect(HTTP_Status.UNAUTHORIZED_401)

            await request(app)
                .delete(`/security/devices`)
                .set("Cookie", `refreshToken=${validRefreshToken}+1`)
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .delete(`/security/devices`)
                .expect(HTTP_Status.UNAUTHORIZED_401)

        })
        it('DELETE should return error if access denied', async () => {
            await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login2",
                    password: "password2",
                    email: "string222@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)

            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login2",
                    password: "password2"
                })
                .expect(HTTP_Status.OK_200)

            await delay();

            const refreshToken2 = result.headers['set-cookie'][0].split(';')[0].split('=')[1];

            await request(app)
                .delete(`/security/devices/${devices[1].deviceId}`)
                .set("Cookie", `refreshToken=${refreshToken2}`)
                .expect(HTTP_Status.FORBIDDEN_403)

        })
        it('POST should not change deviceId after refresh-token, LastActiveDate should be changed', async function () {
            const result = await request(app)
                .post('/auth/refresh-token')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            await delay()
            expect(result.body).toEqual({accessToken: expect.any(String)})
            expect(result.body).not.toEqual(validAccessToken)

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            oldRefreshToken = validRefreshToken;
            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
            expect(refreshTokenKey).toBe('refreshToken')
            expect(oldRefreshToken).not.toEqual(validRefreshToken)
            expect(result.headers['set-cookie'][0].includes('HttpOnly')).toBe(true)
            expect(result.headers['set-cookie'][0].includes('Secure')).toBe(true)

            const resultDeviceList = await request(app)
                .get('/security/devices')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            const newDeviceList: DeviceViewModel[] = resultDeviceList.body
            expect(newDeviceList).toEqual([
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }])
            expect(devices.map(d => d.deviceId)).toEqual(newDeviceList.map(d => d.deviceId))
            expect(devices.map(d => d.lastActiveDate)).not.toEqual(newDeviceList.map(d => d.lastActiveDate))
        });
        it('DELETE should delete device', async () => {
            await request(app)
                .delete(`/security/devices/${devices[1].deviceId}`)
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.NO_CONTENT_204)

            const resultDeviceList = await request(app)
                .get('/security/devices')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            const newDeviceList: DeviceViewModel[] = resultDeviceList.body
            expect(newDeviceList).toEqual([
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                },
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }])
            expect(devices).not.toEqual(newDeviceList)
            devices = newDeviceList
        })
        it('DELETE should delete devices', async () => {
            await request(app)
                .delete(`/security/devices`)
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.NO_CONTENT_204)

            await delay()
            const resultDeviceList = await request(app)
                .get('/security/devices')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            const newDeviceList: DeviceViewModel[] = resultDeviceList.body
            expect(newDeviceList).toEqual([
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }])
            expect(devices).not.toEqual(newDeviceList)
            devices = newDeviceList
        })
        it('POST should logout device', async () => {
            await request(app)
                .post('/auth/logout')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.NO_CONTENT_204)

            const result = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)

            await delay()

            expect(result.headers['set-cookie']).toBeTruthy()
            if (!result.headers['set-cookie']) return

            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');

            const resultDeviceList = await request(app)
                .get('/security/devices')
                .set("Cookie", `refreshToken=${validRefreshToken}`)
                .expect(HTTP_Status.OK_200)

            const newDeviceList: DeviceViewModel[] = resultDeviceList.body
            expect(newDeviceList).toEqual([
                {
                    ip: expect.any(String),
                    title: expect.any(String),
                    lastActiveDate: expect.any(String),
                    deviceId: expect.any(String),
                }])
            expect(devices).not.toEqual(newDeviceList)
        })
/*

        it('POST/registration should return status code 429 if more than 5 requests in 10 seconds, and 204 after waiting', async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.TOO_MANY_REQUESTS_429)

            await delay(10001)

            await request(app)
                .post('/auth/registration')
                .send({
                    login: "NewUser",
                    password: "password",
                    email: ""
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
        }, 35000)
        it('POST/login should return status code 429 if more than 5 requests in 10 seconds, and 401 after waiting ', async function () {
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.TOO_MANY_REQUESTS_429)

            await delay(10000)

            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login0",
                    password: "password0"
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)

        }, 15000);
        it('POST/resending should return status code 429 if more than 5 requests in 10 seconds, and 400 after waiting', async () => {
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.TOO_MANY_REQUESTS_429)

            await delay(10000)

            await request(app)
                .post('/auth/registration-email-resending')
                .send({
                    email: "stringx@sdf.eee"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
        }, 15000)
        it('POST/confirmation should return status code 429 if more than 5 requests in 10 seconds, and 400 after waiting', async () => {
            await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
           await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
           await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
           await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
           await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
           await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.TOO_MANY_REQUESTS_429)

            await delay(10000)

            await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    code: "6"
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
        }, 15000)

*/
    })
    describe('comment likes', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let token: LoginSuccessViewModel
        let user: UserViewModel
        let comment: CommentViewModel
        let post: PostViewModel
        let blog: BlogViewModel
        let user2: UserViewModel
        let token2: LoginSuccessViewModel
        let user3: UserViewModel
        let token3: LoginSuccessViewModel
        let user4: UserViewModel
        let token4: LoginSuccessViewModel
        it('POST should create blog, post, comment and 4 auth users', async () => {
            const resultBlog = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "blogName",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            blog = resultBlog.body

            const resultPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post = resultPost.body

            const resultUser = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user = resultUser.body

            const resultToken = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)
            token = resultToken.body

            const resultUser2 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login2",
                    password: "password2",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user2 = resultUser2.body

            const resultToken2 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login2",
                    password: "password2"
                })
                .expect(HTTP_Status.OK_200)
            token2 = resultToken2.body

            const resultUser3 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login3",
                    password: "password3",
                    email: "string3@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user3 = resultUser3.body

            const resultToken3 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login3",
                    password: "password3"
                })
                .expect(HTTP_Status.OK_200)
            token3 = resultToken3.body

            const resultUser4 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login4",
                    password: "password4",
                    email: "string4@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user4 = resultUser4.body

            const resultToken4 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login4",
                    password: "password4"
                })
                .expect(HTTP_Status.OK_200)
            token4 = resultToken4.body

            const resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment"
                })
                .expect(HTTP_Status.CREATED_201)
            comment = resultComment.body

            expect(comment).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                }
            )
        })
        it('PUT shouldn`t like comment and return 401', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken + 'd', {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('PUT shouldn`t like comment and return 400', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "ErrorStatus"})
                .expect(HTTP_Status.BAD_REQUEST_400)
        });
        it('PUT shouldn`t like comment and return 404', async () => {
            await request(app)
                .put(`/comments/${blog.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NOT_FOUND_404)
        });
        it('PUT should like comment by user1', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedComment = await request(app)
                .get(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(comment).not.toEqual(likedComment.body)
            expect(likedComment.body).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 1,
                        "dislikesCount": 0,
                        "myStatus": "Like"
                    }
                }
            )
        });
        it('GET should return 200 and comments with "myStatus": "None" for non auth user', async () => {
            await request(app)
                .get(`/comments/${comment.id}`)
                .expect(HTTP_Status.OK_200, {
                        id: comment.id,
                        content: comment.content,
                        userId: user.id,
                        userLogin: user.login,
                        createdAt: comment.createdAt,
                        likesInfo: {
                            "likesCount": 1,
                            "dislikesCount": 0,
                            "myStatus": "None"
                        }
                    }
                )
        })
        it('PUT should like comment by user2, user3 and dislike by user4 with get comment by him', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedComment = await request(app)
                .get(`/comments/${comment.id}`)
                .auth(token4.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedComment.body).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 3,
                        "dislikesCount": 1,
                        "myStatus": "Dislike"
                    }
                }
            )
        });
        it('GET should return 200 and comments with "myStatus": "None" for non auth user', async () => {
            await request(app)
                .get(`/comments/${comment.id}`)
                .expect(HTTP_Status.OK_200, {
                        id: comment.id,
                        content: comment.content,
                        userId: user.id,
                        userLogin: user.login,
                        createdAt: comment.createdAt,
                        likesInfo: {
                            "likesCount": 3,
                            "dislikesCount": 1,
                            "myStatus": "None"
                        }
                    }
                )
        })
        it('PUT should dislike comment by user2, user3 and like by user4 with get comment by him', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedComment = await request(app)
                .get(`/comments/${comment.id}`)
                .auth(token4.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedComment.body).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 2,
                        "dislikesCount": 2,
                        "myStatus": "Like"
                    }
                }
            )
        });
        it('PUT should dislike comment by user1 twice. Shouldn`t increase likes count', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedComment = await request(app)
                .get(`/comments/${comment.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedComment.body).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 1,
                        "dislikesCount": 3,
                        "myStatus": "Dislike"
                    }
                }
            )
        });
        it('PUT should set None status all users with get comment by user1', async () => {
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedComment = await request(app)
                .get(`/comments/${comment.id}`)
                .auth(token4.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedComment.body).toEqual(
                {
                    id: expect.any(String),
                    content: "valid comment_comment",
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: expect.any(String),
                    likesInfo: {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                }
            )
        });
        it('create +5 comments then:' +
            ' like comment 1 by user 1, user 2;' +
            ' like comment 2 by user 2, user 3;' +
            ' dislike comment 3 by user 1;' +
            ' like comment 4 by user 1, user 4, user 2, user 3;' +
            ' like comment 5 by user 2, dislike by user 3;' +
            ' like comment 6 by user 1, dislike by user 2.' +
            ' Get the comments by user 1 after all likes', async () => {
            let resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment2"
                })
                .expect(HTTP_Status.CREATED_201)
            const comment2 = {...resultComment.body}

            resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment3"
                })
                .expect(HTTP_Status.CREATED_201)
            const comment3 = {...resultComment.body}

            resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment4"
                })
                .expect(HTTP_Status.CREATED_201)
            const comment4 = {...resultComment.body}

            resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment5"
                })
                .expect(HTTP_Status.CREATED_201)
            const comment5 = {...resultComment.body}

            resultComment = await request(app)
                .post(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .send({
                    content: "valid comment_comment6"
                })
                .expect(HTTP_Status.CREATED_201)
            const comment6 = {...resultComment.body}

            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/comments/${comment2.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment2.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/comments/${comment3.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/comments/${comment4.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment4.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment4.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment4.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/comments/${comment5.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment5.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/comments/${comment6.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/comments/${comment6.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            const result = await request(app)
                .get(`/posts/${post.id}/comments`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(result.body).toEqual({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 6,
                    items: [
                        {
                            id: comment6.id,
                            content: comment6.content,
                            userId: comment6.userId,
                            userLogin: comment6.userLogin,
                            createdAt: comment6.createdAt,
                            likesInfo: {
                                "likesCount": 1,
                                "dislikesCount": 1,
                                "myStatus": "Like"
                            }
                        },
                        {
                            id: comment5.id,
                            content: comment5.content,
                            userId: comment5.userId,
                            userLogin: comment5.userLogin,
                            createdAt: comment5.createdAt,
                            likesInfo: {
                                "likesCount": 1,
                                "dislikesCount": 1,
                                "myStatus": "None"
                            }
                        },
                        {
                            id: comment4.id,
                            content: comment4.content,
                            userId: comment4.userId,
                            userLogin: comment4.userLogin,
                            createdAt: comment4.createdAt,
                            likesInfo: {
                                "likesCount": 4,
                                "dislikesCount": 0,
                                "myStatus": "Like"
                            }
                        },
                        {
                            id: comment3.id,
                            content: comment3.content,
                            userId: comment3.userId,
                            userLogin: comment3.userLogin,
                            createdAt: comment3.createdAt,
                            likesInfo: {
                                "likesCount": 0,
                                "dislikesCount": 1,
                                "myStatus": "Dislike"
                            }
                        },
                        {
                            id: comment2.id,
                            content: comment2.content,
                            userId: comment2.userId,
                            userLogin: comment2.userLogin,
                            createdAt: comment2.createdAt,
                            likesInfo: {
                                "likesCount": 2,
                                "dislikesCount": 0,
                                "myStatus": "None"
                            }
                        },
                        {
                            id: comment.id,
                            content: comment.content,
                            userId: comment.userId,
                            userLogin: comment.userLogin,
                            createdAt: comment.createdAt,
                            likesInfo: {
                                "likesCount": 2,
                                "dislikesCount": 0,
                                "myStatus": "Like"
                            }
                        }
                    ]
                }
            )
            //
            // expect(likedComment.body).toEqual(
            //     {
            //         id: expect.any(String),
            //         content: "valid comment111111111",
            //         userId: user.id,
            //         userLogin: user.login,
            //         createdAt: expect.any(String),
            //         likesInfo: {
            //             "likesCount": 0,
            //             "dislikesCount": 0,
            //             "myStatus": "None"
            //         }
            //     }
            //)
        });

    })
    describe('post likes', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let token: LoginSuccessViewModel
        let user: UserViewModel
        let post: PostViewModel
        let blog: BlogViewModel
        let user2: UserViewModel
        let token2: LoginSuccessViewModel
        let user3: UserViewModel
        let token3: LoginSuccessViewModel
        let user4: UserViewModel
        let token4: LoginSuccessViewModel
        it('POST should create blog, post and 4 auth users', async () => {
            const resultBlog = await request(app)
                .post('/blogs')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "blogName",
                    description: "description",
                    websiteUrl: " https://localhost1.uuu/blogs  "
                })
                .expect(HTTP_Status.CREATED_201)
            blog = resultBlog.body

            const resultPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            post = resultPost.body

            const resultUser = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login",
                    password: "password",
                    email: "string@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user = resultUser.body

            const resultToken = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login",
                    password: "password"
                })
                .expect(HTTP_Status.OK_200)
            token = resultToken.body

            const resultUser2 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login2",
                    password: "password2",
                    email: "string2@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user2 = resultUser2.body

            const resultToken2 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login2",
                    password: "password2"
                })
                .expect(HTTP_Status.OK_200)
            token2 = resultToken2.body

            const resultUser3 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login3",
                    password: "password3",
                    email: "string3@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user3 = resultUser3.body

            const resultToken3 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login3",
                    password: "password3"
                })
                .expect(HTTP_Status.OK_200)
            token3 = resultToken3.body

            const resultUser4 = await request(app)
                .post('/users')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    login: "login4",
                    password: "password4",
                    email: "string4@sdf.ee"
                })
                .expect(HTTP_Status.CREATED_201)
            user4 = resultUser4.body

            const resultToken4 = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: "login4",
                    password: "password4"
                })
                .expect(HTTP_Status.OK_200)
            token4 = resultToken4.body

            expect(post).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LikeStatus.None,
                        newestLikes: []
                    }
                }
            )
        })
        it('PUT shouldn`t like post and return 401', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken + 'd', {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.UNAUTHORIZED_401)
        });
        it('PUT shouldn`t like post and return 400', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "ErrorStatus"})
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.BAD_REQUEST_400)
        });
        it('PUT shouldn`t like post and return 404', async () => {
            await request(app)
                .put(`/posts/${blog.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NOT_FOUND_404)
        });
        it('PUT should like post by user1', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedPost = await request(app)
                .get(`/posts/${post.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(post).not.toEqual(likedPost.body)
            post = likedPost.body
            expect(post).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 1,
                        dislikesCount: 0,
                        myStatus: LikeStatus.Like,
                        newestLikes: [{
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: expect.any(String),
                        }]
                    }
                }
            )
        });
        it('GET should return 200 and post with "myStatus": "None" for non auth user', async () => {
            await request(app)
                .get(`/posts/${post.id}`)
                .expect(HTTP_Status.OK_200, {
                        id: post.id,
                        title: "valid",
                        content: "valid",
                        blogId: `${blog.id}`,
                        blogName: `${blog.name}`,
                        shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                        createdAt: post.createdAt,
                        // extendedLikesInfo: {
                        //     likesCount: 1,
                        //     dislikesCount: 0,
                        //     myStatus: LikeStatus.None,
                        //     newestLikes: post.extendedLikesInfo.newestLikes
                        // }
                    }
                )
        })
        it('PUT should like post by user2, user3 and dislike by user4 with get post by him', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedPost = await request(app)
                .get(`/posts/${post.id}`)
                .auth(token4.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedPost.body).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 3,
                        dislikesCount: 1,
                        myStatus: LikeStatus.Dislike,
                        newestLikes: expect.arrayContaining([{
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: expect.any(String),
                        }])
                    }
                }
            )
        });
        it('GET2 should return 200 and post with "myStatus": "None" for non auth user', async () => {
            const result = await request(app)
                .get(`/posts/${post.id}`)
                .expect(HTTP_Status.OK_200)

            expect(result.body).toEqual({
                        id: expect.any(String),
                        title: "valid",
                        content: "valid",
                        blogId: `${blog.id}`,
                        blogName: `${blog.name}`,
                        shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                            likesCount: 3,
                            dislikesCount: 1,
                            myStatus: LikeStatus.None,
                            newestLikes: expect.arrayContaining([{
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: expect.any(String),
                            }])
                        }
                    }
                )


        })
        it('PUT should dislike post by user2, user3 and like by user4 with get post by him', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedPost = await request(app)
                .get(`/posts/${post.id}`)
                .auth(token4.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedPost.body).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 2,
                        dislikesCount: 2,
                        myStatus: LikeStatus.Like,
                        newestLikes: expect.arrayContaining([{
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: expect.any(String),
                        }])
                    }
                }
            )
        });
        it('PUT should dislike post by user1 twice. Shouldn`t increase likes count', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedPost = await request(app)
                .get(`/posts/${post.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedPost.body).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 1,
                        dislikesCount: 3,
                        myStatus: LikeStatus.Dislike,
                        newestLikes: expect.arrayContaining([{
                            addedAt: expect.any(String),
                            userId: expect.any(String),
                            login: expect.any(String),
                        }])
                    }
                }
            )
        });
        it('PUT should set None status all users with get post by user1', async () => {
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "None"})
                .expect(HTTP_Status.NO_CONTENT_204)
            const likedPost = await request(app)
                .get(`/posts/${post.id}`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(likedPost.body).toEqual(
                {
                    id: expect.any(String),
                    title: "valid",
                    content: "valid",
                    blogId: `${blog.id}`,
                    blogName: `${blog.name}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx",
                    createdAt: expect.any(String),
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LikeStatus.None,
                        newestLikes: []
                    }
                }
            )
        });
        it('create +5 comments then:' +
            ' like comment 1 by user 1, user 2;' +
            ' like comment 2 by user 2, user 3;' +
            ' dislike comment 3 by user 1;' +
            ' like comment 4 by user 1, user 4, user 2, user 3;' +
            ' like comment 5 by user 2, dislike by user 3;' +
            ' like comment 6 by user 1, dislike by user 2.' +
            ' Get the comments by user 1 after all likes', async () => {
            let likedPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid2",
                    content: "valid2",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            const post2 = {...likedPost.body}

            likedPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid3",
                    content: "valid3",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            const post3 = {...likedPost.body}

            likedPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid4",
                    content: "valid4",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            const post4 = {...likedPost.body}

            likedPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid5",
                    content: "valid5",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            const post5 = {...likedPost.body}

            likedPost = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: "valid6",
                    content: "valid6",
                    blogId: `${blog.id}`,
                    shortDescription: "K8cqY3aPKo3XWOJyQgGnlX5sP3aW3RlaRSQx"
                })
                .expect(HTTP_Status.CREATED_201)
            const post6 = {...likedPost.body}

            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/posts/${post2.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post2.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/posts/${post3.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/posts/${post4.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post4.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post4.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post4.id}/like-status`)
                .auth(token4.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/posts/${post5.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post5.id}/like-status`)
                .auth(token3.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            await request(app)
                .put(`/posts/${post6.id}/like-status`)
                .auth(token.accessToken, {type: "bearer"})
                .send({likeStatus: "Like"})
                .expect(HTTP_Status.NO_CONTENT_204)
            await request(app)
                .put(`/posts/${post6.id}/like-status`)
                .auth(token2.accessToken, {type: "bearer"})
                .send({likeStatus: "Dislike"})
                .expect(HTTP_Status.NO_CONTENT_204)

            const result = await request(app)
                .get(`/posts`)
                .auth(token.accessToken, {type: "bearer"})
                .expect(HTTP_Status.OK_200)

            expect(result.body).toEqual({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 6,
                    items: [
                        {
                            id: post6.id,
                            title: post6.title,
                            content: post6.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post6.shortDescription,
                            createdAt: post6.createdAt,
                            extendedLikesInfo: {
                                likesCount: 1,
                                dislikesCount: 1,
                                myStatus: LikeStatus.Like,
                                newestLikes: expect.arrayContaining([{
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: expect.any(String),
                                }])
                            }
                        },
                        {
                            id: post5.id,
                            title: post5.title,
                            content: post5.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post5.shortDescription,
                            createdAt: post5.createdAt,
                            extendedLikesInfo: {
                                likesCount: 1,
                                dislikesCount: 1,
                                myStatus: LikeStatus.None,
                                newestLikes: expect.arrayContaining([{
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: expect.any(String),
                                }])
                            }
                        },
                        {
                            id: post4.id,
                            title: post4.title,
                            content: post4.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post4.shortDescription,
                            createdAt: post4.createdAt,
                            extendedLikesInfo: {
                                likesCount: 4,
                                dislikesCount: 0,
                                myStatus: LikeStatus.Like,
                                newestLikes: expect.arrayContaining([{
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: expect.any(String),
                                }])
                            }
                        },
                        {
                            id: post3.id,
                            title: post3.title,
                            content: post3.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post3.shortDescription,
                            createdAt: post3.createdAt,
                            extendedLikesInfo: {
                                likesCount: 0,
                                dislikesCount: 1,
                                myStatus: LikeStatus.Dislike,
                                newestLikes: []
                            }
                        },
                        {
                            id: post2.id,
                            title: post2.title,
                            content: post2.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post2.shortDescription,
                            createdAt: post2.createdAt,
                            extendedLikesInfo: {
                                likesCount: 2,
                                dislikesCount: 0,
                                myStatus: LikeStatus.None,
                                newestLikes: expect.arrayContaining([{
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: expect.any(String),
                                }])
                            }
                        },
                        {
                            id: post.id,
                            title: post.title,
                            content: post.content,
                            blogId: `${blog.id}`,
                            blogName: `${blog.name}`,
                            shortDescription: post.shortDescription,
                            createdAt: post.createdAt,
                            extendedLikesInfo: {
                                likesCount: 2,
                                dislikesCount: 0,
                                myStatus: LikeStatus.Like,
                                newestLikes: expect.arrayContaining([{
                                    addedAt: expect.any(String),
                                    userId: expect.any(String),
                                    login: expect.any(String),
                                }])
                            }
                        },
                    ]
                }
            )
            //
            // expect(likedComment.body).toEqual(
            //     {
            //         id: expect.any(String),
            //         content: "valid comment111111111",
            //         userId: user.id,
            //         userLogin: user.login,
            //         createdAt: expect.any(String),
            //         likesInfo: {
            //             "likesCount": 0,
            //             "dislikesCount": 0,
            //             "myStatus": "None"
            //         }
            //     }
            //)
        });
    })

    /*
    describe('test', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        it('POST should create blog, post, comment and 4 auth users', async () => {
        });

    })
*/
    /*
        describe('registration', () => {
            beforeAll(async () => {
                await request(app)
                    .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
            })
            it('POST should create user and send email', async () => {
                await request(app)
                    .post('/auth/registration')
                    .send({
                        login: "NewUser",
                        password: "password",
                        email: settings.TEST_EMAIL
                    })
                    .expect(HTTP_Status.NO_CONTENT_204)
            })
            it('POST shouldn`t create user with valid login or email', async () => {
                await request(app)
                    .post('/auth/registration')
                    .send({
                        login: "NewUser",
                        password: "password",
                        email: "test1@test.it"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
                await request(app)
                    .post('/auth/registration')
                    .send({
                        login: "NewUser2",
                        password: "password",
                        email: settings.TEST_EMAIL
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
                await request(app)
                    .post('/auth/registration')
                    .send({
                        login: "NewUser2",
                        password: "",
                        email: "test2@test.it"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('POST should resend email', async () => {
                await request(app)
                    .post('/auth/registration-email-resending')
                    .send({
                        email: settings.TEST_EMAIL
                    })
                    .expect(HTTP_Status.NO_CONTENT_204)
            })
            it('POST shouldn`t resend email because time to resend isn`t come', async () => {
                await request(app)
                    .post('/auth/registration-email-resending')
                    .send({
                        email: settings.TEST_EMAIL
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('POST shouldn`t resend email', async () => {
                await request(app)
                    .post('/auth/registration-email-resending')
                    .send({
                        email: "test1@test.it"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('POST shouldn`t confirm registration because code is old', async () => {
                await request(app)
                    .post('/auth/registration-confirmation')
                    .send({
                        code: "test"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('shouldn`t authenticate not confirmed user ', async function () {
                await request(app)
                    .post('/auth/login')
                    .send({
                        loginOrEmail: "NewUser",
                        password: "password",
                    })
                    .expect(HTTP_Status.UNAUTHORIZED_401)
            });
            it('POST should confirm registration', async () => {
                await request(app)
                    .post('/auth/registration-confirmation')
                    .send({
                        code: "testres"
                    })
                    .expect(HTTP_Status.NO_CONTENT_204)
            })
            it('should authenticate confirmed user ', async function () {
                await request(app)
                    .post('/auth/login')
                    .send({
                        loginOrEmail: "NewUser",
                        password: "password",
                    })
                    .expect(HTTP_Status.OK_200)
            });
            it('POST shouldn`t confirm registration if already confirm', async () => {
                await request(app)
                    .post('/auth/registration-confirmation')
                    .send({
                        code: "test"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('POST shouldn`t confirm registration if valid code', async () => {
                await request(app)
                    .post('/auth/registration-confirmation')
                    .send({
                        code: "6"
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('POST shouldn`t resend email if registration already confirmed', async () => {
                await request(app)
                    .post('/auth/registration-email-resending')
                    .send({
                        email: settings.TEST_EMAIL
                    })
                    .expect(HTTP_Status.BAD_REQUEST_400)
            })
            it('get 1 user', async () => {
                const users = await request(app)
                    .get('/users')
                    .expect(200)
                expect(users.body).toEqual({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [{
                        id: expect.any(String),
                        login: "NewUser",
                        email: settings.TEST_EMAIL,
                        createdAt: expect.any(String),
                    }]
                })
            })
        })
    */
})