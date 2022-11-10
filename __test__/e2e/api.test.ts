import request from "supertest"
import {app} from "../../src";
import {TypeBlogViewModel} from "../../src/models/BlogViewModel";
import {runDb} from "../../src/repositories/db";
import {TypePostViewModel} from "../../src/models/PostViewModel";
import {TypeUserViewModel} from "../../src/models/UserViewModel";

describe('/blogs', () => {
    beforeAll(async () => {
        await runDb()
        await request(app)
            .delete('/testing/all-data').expect(204)
    })
    let blog1: TypeBlogViewModel
    let blog2: TypeBlogViewModel
    it('GET should return 200', async function () {
        await request(app)
            .get('/blogs')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    });
    it('POST should`t create blog with incorrect "data"', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": "    ",
                "youtubeUrl": " https://localhost:5000/blogs  "
            })
            .expect(400)
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": "valid name",
                "youtubeUrl": " htt://localhost:5000/blogs  "
            })
            .expect(400)

        await request(app)
            .get('/blogs')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
    it('POST should create blog with correct data', async () => {
        const result = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": " NEW NAME   ",
                "youtubeUrl": " https://localhost:5000/blogs  "
            })
            .expect(201)
        blog1 = result.body

        expect(blog1).toEqual(
            {
                "id": expect.any(String),
                "name": "NEW NAME",
                "youtubeUrl": "https://localhost:5000/blogs",
                "createdAt": expect.any(String)
            }
        )
        await request(app)
            .get('/blogs')
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [blog1]
            })
    })
    it('PUT should`t update blog with incorrect "name"', async () => {

        await request(app).put(`/blogs/${blog1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": "    ",
                "youtubeUrl": "https://api-swagger.it-incubator.ru/"
            })
            .expect(400)
    })
    it('PUT should`t update blog with incorrect "youtubeUrl"', async () => {

        await request(app).put(`/blogs/${blog1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": "valid name",
                "youtubeUrl": "http://api-swagger.it-incubator"
            })
            .expect(400)
    })
    it('PUT should`t update blog with incorrect "id"', async () => {
        await request(app).put(`/blogs/1`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": " Updating NAME   ",
                "youtubeUrl": "https://api-swagger.it-incubator.ru/"
            })
            .expect(404)
    })
    it('PUT should update blog with correct data', async () => {
        await request(app).put(`/blogs/${blog1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": " Updating NAME   ",
                "youtubeUrl": "https://api-swagger.it-incubator.ru/"
            })
            .expect(204)
        const result = await request(app)
            .get(`/blogs/${blog1.id}`)
            .expect(200)
        blog2 = result.body
        expect(blog2).toEqual(
            {
                "id": expect.any(String),
                "name": "Updating NAME",
                "youtubeUrl": "https://api-swagger.it-incubator.ru/",
                "createdAt": expect.any(String)
            })
        expect(blog2).not.toEqual(blog1)
    })
    it('DELETE should`t delete blog with incorrect "id"', async () => {
        await request(app).delete(`/blogs/1`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(404)

        await request(app)
            .get(`/blogs/${blog1.id}`)
            .expect(200, blog2)
    })
    it('DELETE should delete blog with correct "id"', async () => {
        await request(app).delete(`/blogs/${blog1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(204)
        await request(app)
            .get('/blogs')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
})

describe('/posts', () => {
    beforeAll(async () => {
        await runDb()
        await request(app)
            .delete('/testing/all-data').expect(204)
    })
    let post1: TypePostViewModel
    let post2: TypePostViewModel
    let blog1: TypeBlogViewModel
    it('GET should return 200', async function () {
        await request(app)
            .get('/posts')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    });
    it('GET By Id should return 404', async function () {
        await request(app)
            .get('/posts/1')
            .expect(404)

    });
    it('POST should`t create post with incorrect data', async () => {
        const result = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "name": "blogName",
                "youtubeUrl": " https://localhost:5000/blogs  "
            })
            .expect(201)
        blog1 = result.body

        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "",
                "content": "valid",
                "blogId": `${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "",
                "blogId": `${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `1`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `${blog1.id}`,
                "shortDescription": ""
            })
            .expect(400)

        await request(app)
            .get('/posts')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
    it('POST should create blog with correct data', async () => {
        const result = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(201)
        post1 = result.body

        expect(post1).toEqual(
            {
                "id": expect.any(String),
                "title": "valid",
                "content": "valid",
                "blogId": `${blog1.id}`,
                "blogName": `${blog1.name}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx",
                "createdAt": expect.any(String)
            }
        )
        await request(app)
            .get('/posts')
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [post1]
            })
    })
    it('PUT should`t update blog with incorrect "name"', async () => {

        await request(app)
            .put(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "",
                "content": "valid",
                "blogId": `${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .put(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "",
                "blogId": `/posts/${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .put(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `/posts/1`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
        await request(app)
            .put(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `/posts/${blog1.id}`,
                "shortDescription": ""
            })
            .expect(400)
        await request(app)
            .put(`/posts/1`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "valid",
                "content": "valid",
                "blogId": `/posts/${blog1.id}`,
                "shortDescription": "K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
            })
            .expect(400)
    })
    it('PUT should update blog with correct data', async () => {
        await request(app).put(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "title": "Update POST",
                "shortDescription": "Update shortDescription",
                "content": "Update content",
                "blogId": `${blog1.id}`
            })
            .expect(204)
        const result = await request(app)
            .get(`/posts/${post1.id}`)
            .expect(200)
        post2 = result.body
        expect(post2).toEqual(
            {
                "id": expect.any(String),
                "title": "Update POST",
                "content": "Update content",
                "blogId": `${blog1.id}`,
                "blogName": `${blog1.name}`,
                "shortDescription": "Update shortDescription",
                "createdAt": expect.any(String)
            })
        expect(post2).not.toEqual(post1)
    })
    it('DELETE should`t delete blog with incorrect "id"', async () => {
        await request(app).delete(`/posts/1`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(404)

        await request(app)
            .get(`/posts/${post1.id}`)
            .expect(200, post2)
    })
    it('DELETE should delete blog with correct "id"', async () => {
        await request(app).delete(`/posts/${post1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(204)
        await request(app)
            .get('/posts')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
})

describe('/users', () => {
    beforeAll(async () => {
        await runDb()
        await request(app)
            .delete('/testing/all-data').expect(204)
    })
    let user1: TypeUserViewModel
    it('GET should return 200', async function () {
        await request(app)
            .get('/users')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    });
    it('POST should`t create user with incorrect data', async () => {
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "",
                "password": "password",
                "email": "string2@sdf.ee"
            })
            .expect(400)
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "",
                "email": "string2@sdf.ee"
            })
            .expect(400)
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "password",
                "email": "stringsdf.ee"
            })
            .expect(400)

        await request(app)
            .get('/users')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
    it('POST should create user with correct data', async () => {
        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "password",
                "email": "string2@sdf.ee"
            })
            .expect(201)
        user1 = result.body

        expect(user1).toEqual(
            {
                "id": expect.any(String),
                "login": "login",
                "email": "string2@sdf.ee",
                "createdAt": expect.any(String)
            }
        )
        await request(app)
            .get('/users')
            .expect(200, {
                "pagesCount": 1,
                "page": 1,
                "pageSize": 10,
                "totalCount": 1,
                "items": [user1]
            })
    })
    it('DELETE should`t delete blog with incorrect "id"', async () => {
        await request(app).delete(`/users/1`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(404)
    })
    it('DELETE should delete blog with correct "id"', async () => {
        await request(app).delete(`/users/${user1.id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(204)
        await request(app)
            .get('/users')
            .expect(200, {
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
    })
})

describe('/auth/login', () => {
    beforeAll(async () => {
        await runDb()
        await request(app)
            .delete('/testing/all-data').expect(204)
    })
    let user: TypeUserViewModel
    it('POST should`t authenticate user with incorrect data', async () => {
        const result = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "password",
                "email": "string2@sdf.ee"
            })
            .expect(201)
        user = result.body
        await request(app)
            .post('/auth/login')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "password3",
            })
            .expect(401)
        await request(app)
            .post('/auth/login')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "",
                "password": "password3",
            })
            .expect(400)
        await request(app)
            .post('/auth/login')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login",
                "password": "",
            })
            .expect(400)
        await request(app)
            .post('/auth/login')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                "login": "login1",
                "password": "password",
            })
            .expect(401)
    })
    it('POST should authenticate user with correct data', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                "login": "login",
                "password": "password"
            })
            .expect(204)
    })
})
