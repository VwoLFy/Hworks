import { BlogViewModel } from "../../src/blogs/api/models/BlogViewModel";
import { CreateBlogDto } from "../../src/blogs/application/dto/CreateBlogDto";
import { runDb } from "../../src/main/db";
import HelpersForTests from "../Utils/HelpersForTests";
import { HTTP_Status } from "../../src/main/types/enums";
import { UpdateBlogDto } from "../../src/blogs/application/dto/UpdateBlogDto";
import mongoose from 'mongoose';

describe("Public-    blogs", () => {
  beforeAll(async () => {
    await runDb();
    await HelpersForTests.deleteAllData();
  });

  afterAll(async () => {
    await mongoose.disconnect()
  })

  let blog1: BlogViewModel;
  let blog2: BlogViewModel;
  let blog3: BlogViewModel;
  const prepareDto = (dto: CreateBlogDto): BlogViewModel => {
    return {
      id: expect.any(String),
      name: dto.name.trim(),
      description: dto.description.trim(),
      websiteUrl: dto.websiteUrl.trim(),
      createdAt: expect.any(String),
      isMembership: false,
    };
  };
  const emptyResult = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: []
  }

  it("GET blogs should return 200", async function () {
    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual(emptyResult);
  });
  it('POST shouldn`t create blog with incorrect "data"', async () => {
    let dto: CreateBlogDto = {
      name: "    ",
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, "name");

    dto = {
      name: "valid name",
      description: "description",
      websiteUrl: " htt://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "valid name",
      description: "        ",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      // @ts-ignore
      name: 1,
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, "name");

    dto = {
      name: "valid name",
      description: "description",
      // @ts-ignore
      websiteUrl: 1,
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "valid name",
      // @ts-ignore
      description: 1,
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    // @ts-ignore
    dto = {
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, "name");

    // @ts-ignore
    dto = {
      name: "valid name",
      description: "description",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    // @ts-ignore
    dto = {
      name: "valid name",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      name: "a".repeat(16),
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, "name");

    dto = {
      name: "valid name",
      description: "a".repeat(501),
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      name: "valid name",
      description: "description",
      websiteUrl: "https://localhost1.uuu/blogs" + "a".repeat(100),
    };
    await HelpersForTests.createBlog(
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "    ",
      description: "      ",
      websiteUrl: "https://localhost1.uuu/blogs" + "a".repeat(100),
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, [
      "name",
      "description",
      "websiteUrl",
    ]);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual(emptyResult);
  });
  it("POST shouldn`t create blog without authorize", async () => {
    let dto: CreateBlogDto = {
      name: " NEW NAME   ",
      description: "description   ",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.UNAUTHORIZED_401);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual(emptyResult);
  });
  it("POST should create 3 blogs", async () => {
    let dto: CreateBlogDto = {
      name: " NEW NAME   ",
      description: "description   ",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    let result = await HelpersForTests.createBlog(dto);
    if (result) blog1 = result;

    expect(blog1).toEqual(prepareDto(dto));

    dto = {
      name: "what name 2  ",
      description: "a_description  2",
      websiteUrl: " https://localhost1.uuu/blogs2  ",
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog2 = result;

    expect(blog2).toEqual(prepareDto(dto));

    dto = {
      name: "  user2 blog  ",
      description: "description  3",
      websiteUrl: " https://localhost1.uuu/blogs3  ",
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog3 = result;

    expect(blog3).toEqual(prepareDto(dto));
  });
  it("GET blog by id should return blog", async function () {
    const blog = await HelpersForTests.findBlogById(blog1.id);
    expect(blog).toEqual(blog1);
  });
  it("GET blog by bad id should return 404", async function () {
    await HelpersForTests.findBlogById("1", HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.findBlogById(
      "9f38bedb-370a-47d0-9ef1-42f6294a1478",
      HTTP_Status.NOT_FOUND_404,
    );
  });
  it("GET blogs should return 200", async function () {
    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [blog3, blog2, blog1]
    });
  });
  it("PUT shouldn`t update blog with incorrect data", async () => {
    let dto: UpdateBlogDto = {
      name: "    ",
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "name",
    );

    dto = {
      name: "valid name",
      description: "description",
      websiteUrl: " htt://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "valid name",
      description: "        ",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      // @ts-ignore
      name: 1,
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "name",
    );

    dto = {
      name: "valid name",
      description: "description",
      // @ts-ignore
      websiteUrl: 1,
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "valid name",
      // @ts-ignore
      description: 1,
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    // @ts-ignore
    dto = {
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "name",
    );

    // @ts-ignore
    dto = {
      name: "valid name",
      description: "description",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    // @ts-ignore
    dto = {
      name: "valid name",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      name: "a".repeat(16),
      description: "description",
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "name",
    );

    dto = {
      name: "valid name",
      description: "a".repeat(501),
      websiteUrl: " https://localhost1.uuu/blogs  ",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "description",
    );

    dto = {
      name: "valid name",
      description: "description",
      websiteUrl: "https://localhost1.uuu/blogs" + "a".repeat(100),
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      "websiteUrl",
    );

    dto = {
      name: "    ",
      description: "      ",
      websiteUrl: "https://localhost1.uuu/blogs" + "a".repeat(100),
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.BAD_REQUEST_400,
      ["name", "description", "websiteUrl"],
    );

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [blog3, blog2, blog1]
    });
  });
  it("PUT shouldn`t update not existing blog", async () => {
    const dto: UpdateBlogDto = {
      name: " Updating NAME   ",
      description: "Updating description",
      websiteUrl: "https://api-swagger.it-incubator.ru/",
    };
    await HelpersForTests.updateBlog(
      "blog1.id",
      dto,
      HTTP_Status.NOT_FOUND_404,
    );
  });
  it("PUT shouldn`t update without authorize", async () => {
    const dto: UpdateBlogDto = {
      name: " Updating NAME   ",
      description: "Updating description",
      websiteUrl: "https://api-swagger.it-incubator.ru/",
    };
    await HelpersForTests.updateBlog(
      blog1.id,
      dto,
      HTTP_Status.UNAUTHORIZED_401,
    );
  });
  it("PUT should update blog with correct data", async () => {
    const oldBlog1 = { ...blog1 };

    const dto: UpdateBlogDto = {
      name: " Updating NAME   ",
      description: "Updating description",
      websiteUrl: "https://api-swagger.it-incubator.ru/",
    };
    await HelpersForTests.updateBlog(blog1.id, dto);

    const result = await HelpersForTests.findBlogById(blog1.id);
    if (result) blog1 = result;

    expect(blog1).toEqual({ ...prepareDto(dto), id: blog1.id });
    expect(blog1).not.toEqual(oldBlog1);
  });
  it("DELETE shouldn`t delete blog without authorize", async () => {
    await HelpersForTests.deleteBlog(blog1.id, HTTP_Status.UNAUTHORIZED_401);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [blog3, blog2, blog1]
    });
  });
  it("DELETE should delete blog", async () => {
    await HelpersForTests.deleteBlog(blog1.id);
    await HelpersForTests.findBlogById(blog1.id, HTTP_Status.NOT_FOUND_404);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog3, blog2]
    });
  });
  it('DELETE shouldn`t delete blog with incorrect "id"', async () => {
    await HelpersForTests.deleteBlog("blog1.id", HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.deleteBlog(
      "9f38bedb-370a-47d0-9ef1-42f6294a1478",
      HTTP_Status.NOT_FOUND_404,
    );
    await HelpersForTests.deleteBlog(blog1.id, HTTP_Status.NOT_FOUND_404);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [blog3, blog2]
    });
  });
});
