import HelpersForTests from "../Utils/HelpersForTests";
import { runDb } from "../../src/main/db";
import { BlogViewModel } from "../../src/blogs/api/models/BlogViewModel";
import { PostViewModel } from "../../src/posts/api/models/PostViewModel";
import { CreatePostDto } from "../../src/posts/application/dto/CreatePostDto";
import { CreateBlogDto } from "../../src/blogs/application/dto/CreateBlogDto";
import { HTTP_Status } from "../../src/main/types/enums";
import { UpdatePostDto } from "../../src/posts/application/dto/UpdatePostDto";
import mongoose from 'mongoose';
import { BlogPostInputModel } from '../../src/blogs/api/models/BlogPostInputModel';

describe("Public-    posts", () => {
  beforeAll(async () => {
    await runDb();
    await HelpersForTests.deleteAllData();
  });

  afterAll(async () => {
    await mongoose.disconnect()
  })

  let blog1: BlogViewModel;
  let blog2: BlogViewModel;
  let post1: PostViewModel;
  let post2: PostViewModel;
  let post3: PostViewModel;
  let post4: PostViewModel;
  const prepareDto = (dto: CreatePostDto): PostViewModel => {
    return {
      id: expect.any(String),
      title: dto.title.trim(),
      shortDescription: dto.shortDescription.trim(),
      content: dto.content.trim(),
      blogId: dto.blogId,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    };
  };
  const emptyResult = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
  }

  it("Create 2 blogs ", async function () {
    let dto: CreateBlogDto = {
      name: " NEW NAME 1  ",
      description: "description 1  ",
      websiteUrl: " https://localhost1.uuu/blogs1  ",
    };
    let result = await HelpersForTests.createBlog(dto);
    if (result) blog1 = result;

    dto = {
      name: " NAME 2  ",
      description: "description 2  ",
      websiteUrl: " https://localhost1.uuu/blogs2  ",
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog2 = result;
  });

  it("GET posts should return 200", async function () {
    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual( emptyResult );
  });
  it('POST shouldn`t create post with incorrect "data"', async () => {
    let dto: CreatePostDto = {
      title: " ",
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      // @ts-ignore
      title: 1,
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      title: "a".repeat(31),
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, "title");

    // @ts-ignore
    dto = {
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      title: "valid title",
      content: "  ",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      // @ts-ignore
      content: 1,
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      content: "a".repeat(1001),
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "  ",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      // @ts-ignore
      shortDescription: 1,
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "a".repeat(101),
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      content: "valid content",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "",
      shortDescription: "    ",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, [
      "content",
      "shortDescription",
    ]);

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "some shortDescription",
      // @ts-ignore
      blogId: 1,
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "blogId",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPost(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "blogId",
    );

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(emptyResult);
  });
  it("POST shouldn`t create post without authorize", async () => {
    let dto: CreatePostDto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.UNAUTHORIZED_401);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(emptyResult);
  });
  it("POST should create 3 posts", async () => {
    let dto: CreatePostDto = {
      title: "valid title 1",
      content: "valid content 1",
      shortDescription: "some shortDescription 1",
      blogId: blog1.id,
    };
    let result = await HelpersForTests.createPost(dto);
    if (result) post1 = result;

    expect(post1).toEqual(prepareDto(dto));

    dto = {
      title: "valid title 2",
      content: "valid content 2",
      shortDescription: "some shortDescription 2",
      blogId: blog1.id,
    };
    result = await HelpersForTests.createPost(dto);
    if (result) post2 = result;

    expect(post2).toEqual(prepareDto(dto));

    dto = {
      title: "valid title 3",
      content: "valid content 3",
      shortDescription: "some shortDescription 3",
      blogId: blog1.id,
    };
    result = await HelpersForTests.createPost(dto);
    if (result) post3 = result;

    expect(post3).toEqual(prepareDto(dto));
  });
  it("GET post by id should return post", async function () {
    const post = await HelpersForTests.findPostById(post1.id);
    expect(post).toEqual(post1);
  });
  it("GET post by bad id should return 404", async function () {
    await HelpersForTests.findPostById("-1", HTTP_Status.NOT_FOUND_404);
  });
  it("GET posts should return 200", async function () {
    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [post3, post2, post1]
      });
  });
  it('GET posts with query should return 200', async function () {
    let query = '?sortDirection=asc'
    let posts = await HelpersForTests.findPosts(query);
    expect(posts).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [post1, post2, post3]
    });

    query = '?sortBy=title'
    posts = await HelpersForTests.findPosts(query);
    expect(posts).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [post3, post2, post1]
    });

    query = '?pageSize=1'
    posts = await HelpersForTests.findPosts(query);
    expect(posts).toEqual({
      pagesCount: 3,
      page: 1,
      pageSize: 1,
      totalCount: 3,
      items: [post3]
    });

    query = '?searchNameTerm=name&pageSize=2&pageNumber=2'
    posts = await HelpersForTests.findPosts(query);
    expect(posts).toEqual({
      pagesCount: 2,
      page: 2,
      pageSize: 2,
      totalCount: 3,
      items: [post1]
    });

  });
  it("PUT shouldn`t update post with incorrect data", async () => {
    let dto: UpdatePostDto = {
      title: " ",
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "title",
    );

    dto = {
      // @ts-ignore
      title: 1,
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "title",
    );

    dto = {
      title: "a".repeat(31),
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "title",
    );

    // @ts-ignore
    dto = {
      content: "valid content",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "title",
    );

    dto = {
      title: "valid title",
      content: "  ",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      // @ts-ignore
      content: 1,
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      content: "a".repeat(1001),
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "content",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "  ",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      // @ts-ignore
      shortDescription: 1,
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "a".repeat(101),
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      content: "valid content",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "shortDescription",
    );

    dto = {
      title: "valid title",
      content: "",
      shortDescription: "    ",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      ["content", "shortDescription"],
    );

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "some shortDescription",
      // @ts-ignore
      blogId: 1,
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "blogId",
    );

    // @ts-ignore
    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.updatePost(
      post1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "blogId",
    );

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [post3, post2, post1]
      });
  });
  it("PUT shouldn`t update not existing post", async () => {
    const dto: UpdatePostDto = {
      title: "Updating title 1",
      content: "Updating content 1",
      shortDescription: "Updating shortDescription 1",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      "post1.id",
      dto,
      HTTP_Status.NOT_FOUND_404,
    );
  });
  it("PUT shouldn`t update without authorize", async () => {
    const dto: UpdatePostDto = {
      title: "Updating title 1",
      content: "Updating content 1",
      shortDescription: "Updating shortDescription 1",
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(
      "post1.id",
      dto,
      HTTP_Status.UNAUTHORIZED_401,
    );
  });
  it("PUT should update post with correct data", async () => {
    const oldPost1 = { ...post1 };
    let blogName;

    const dto: UpdatePostDto = {
      title: "Updating title 1",
      content: "Updating content 1",
      shortDescription: "Updating shortDescription 1",
      blogId: blog2.id,
    };
    await HelpersForTests.updatePost(post1.id, dto);

    const result = await HelpersForTests.findPostById(post1.id);
    if (result) post1 = result;

    const blog = await HelpersForTests.findBlogById(dto.blogId);
    if (blog) blogName = blog.name;

    expect(post1).toEqual({ ...prepareDto(dto), id: post1.id, blogName });
    expect(post1).not.toEqual(oldPost1);
  });
  it("DELETE shouldn`t delete post without authorize", async () => {
    await HelpersForTests.deletePost(post2.id, HTTP_Status.UNAUTHORIZED_401);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [post3, post2, post1]
      });
  });
  it("DELETE should delete post", async () => {
    await HelpersForTests.deletePost(post2.id);
    await HelpersForTests.findPostById(post2.id, HTTP_Status.NOT_FOUND_404);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [post3, post1]
      });
  });
  it('DELETE shouldn`t delete post with incorrect "id"', async () => {
    await HelpersForTests.deletePost("post2.id", HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.deletePost(
      "9f38bedb-370a-47d0-9ef1-42f6294a1478",
      HTTP_Status.NOT_FOUND_404,
    );
    await HelpersForTests.deletePost(post2.id, HTTP_Status.NOT_FOUND_404);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [post3, post1]
      });  });
  it('GET all posts for bad blog should return 404', async function () {
    await HelpersForTests.findPostsForBlog('-1','' ,HTTP_Status.NOT_FOUND_404)
  });
  it('POST shouldn`t create post with incorrect "data" for blog2', async () => {
    const postsStart = await HelpersForTests.findPosts();

    let dto: BlogPostInputModel = {
      title: " ",
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      // @ts-ignore
      title: 1,
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      title: "a".repeat(31),
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "title");

    // @ts-ignore
    dto = {
      content: "valid content",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "title");

    dto = {
      title: "valid title",
      content: "  ",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "content");

    dto = {
      title: "valid title",
      // @ts-ignore
      content: 1,
      shortDescription: "some shortDescription",
      blogId: blog1.id,
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "content");

    dto = {
      title: "valid title",
      content: "a".repeat(1001),
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "content");

    // @ts-ignore
    dto = {
      title: "valid title",
      shortDescription: "some shortDescription",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "content");

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "  ",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "shortDescription");


    dto = {
      title: "valid title",
      content: "valid content",
      // @ts-ignore
      shortDescription: 1,
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "shortDescription");

    dto = {
      title: "valid title",
      content: "valid content",
      shortDescription: "a".repeat(101),
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "shortDescription");

    // @ts-ignore
    dto = {
      title: "valid title",
      content: "valid content",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, "shortDescription");

    dto = {
      title: "valid title",
      content: "",
      shortDescription: "    ",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.BAD_REQUEST_400, [
      "content",
      "shortDescription",
    ]);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(postsStart);
  });
  it("POST shouldn`t create post without authorize for blog2", async () => {
    const postsStart = await HelpersForTests.findPosts();

    let dto: BlogPostInputModel = {
      title: "valid title 4",
      content: "valid content 4",
      shortDescription: "some shortDescription 4",
    };
    await HelpersForTests.createPostForBlog(blog2.id, dto, HTTP_Status.UNAUTHORIZED_401);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual(postsStart);
  });
  it('POST should create post for blog2', async () => {
    let dto: BlogPostInputModel = {
      title: "valid title 4",
      content: "valid content 4",
      shortDescription: "some shortDescription 4",
    };
    let result = await HelpersForTests.createPostForBlog(blog2.id, dto);
    if (result) post4 = result;

    expect(post4).toEqual(prepareDto({ ...dto, blogId: blog2.id }));
  })
  it('GET all posts for specific blog should return 200', async function () {
    const posts = await HelpersForTests.findPostsForBlog(blog2.id)

    expect(posts).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [post4, post1]
      });
  });
  it('GET posts by BlogId with query should return 200', async function () {
    let query = '?sortDirection=asc'
    let posts = await HelpersForTests.findPostsForBlog(blog2.id, query);
    expect(posts).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post1, post4]
    });

    query = '?sortBy=title'
    posts = await HelpersForTests.findPostsForBlog(blog2.id, query);
    expect(posts).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [post4, post1]
    });

    query = '?pageSize=1'
    posts = await HelpersForTests.findPostsForBlog(blog2.id, query);
    expect(posts).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 1,
      totalCount: 2,
      items: [post4]
    });

    query = '?searchNameTerm=name&pageSize=1&pageNumber=2'
    posts = await HelpersForTests.findPostsForBlog(blog2.id, query);
    expect(posts).toEqual({
      pagesCount: 2,
      page: 2,
      pageSize: 1,
      totalCount: 2,
      items: [post1]
    });

  });
});
