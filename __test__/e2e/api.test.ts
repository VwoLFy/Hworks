import request from "supertest"
import {TypeBlogViewModel} from "../../src/models/BlogViewModel";
import {TypePostViewModel} from "../../src/models/PostViewModel";
import {TypeUserViewModel} from "../../src/models/UserViewModel";
import {client} from "../../src/repositories/db";
import {TypeLoginSuccessViewModel} from "../../src/models/LoginSuccessViewModel";
import {TypeCommentViewModel} from "../../src/models/CommentViewModel";
import {TypeErrorResult} from "../../src/middlewares/input-validation-middleware";
import {app} from "../../src/app_config";
import {HTTP_Status} from "../../src/types/enums";
import {TypeDeviceViewModel} from "../../src/models/DeviceViewModel";

const checkError = (apiErrorResult: TypeErrorResult, field: string) => {
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
    afterAll(async () => {
        await client.close()
    })

    describe('/blogs', () => {
        beforeAll(async () => {
            await request(app)
                .delete('/testing/all-data').expect(HTTP_Status.NO_CONTENT_204)
        })
        let blog1: TypeBlogViewModel
        let blog2: TypeBlogViewModel
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
        let post1: TypePostViewModel
        let post2: TypePostViewModel
        let blog1: TypeBlogViewModel
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
                    createdAt: expect.any(String)
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
                    createdAt: expect.any(String)
                })
            expect(post2).not.toEqual(post1)
        })
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
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
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
        let user1: TypeUserViewModel
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
        let user: TypeUserViewModel
        let validAccessToken: TypeLoginSuccessViewModel, oldAccessToken: TypeLoginSuccessViewModel
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
            await request(app)
                .post('/auth/login')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    loginOrEmail: "login",
                    password: "",
                })
                .expect(HTTP_Status.BAD_REQUEST_400)
            await request(app)
                .post('/auth/login')
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    loginOrEmail: "login1",
                    password: "password",
                })
                .expect(HTTP_Status.UNAUTHORIZED_401)
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
        it('POST should authenticate user with correct email', async () => {
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

        })
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
        let token: TypeLoginSuccessViewModel
        let user: TypeUserViewModel
        let comment: TypeCommentViewModel
        let post: TypePostViewModel
        let blog: TypeBlogViewModel
        let user2: TypeUserViewModel
        let token2: TypeLoginSuccessViewModel
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
                            createdAt: comment.createdAt
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
                    createdAt: comment.createdAt
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
        let user: TypeUserViewModel
        let validAccessToken: TypeLoginSuccessViewModel
        let refreshTokenKey: string, validRefreshToken: string
        let devices: TypeDeviceViewModel[]
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

            [refreshTokenKey, validRefreshToken] = result.headers['set-cookie'][0].split(';')[0].split('=');
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
    })

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