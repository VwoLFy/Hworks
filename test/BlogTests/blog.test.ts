import helpersForTests from '../Utils/HelpersForTests';
import HelpersForTests from '../Utils/HelpersForTests';
import { BlogInputModel, BlogViewModel } from '../../src/repositories/blogs-repository';
import { HTTP_Status } from '../../src/enums';

describe('Public-    blogs', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  let blog1: BlogViewModel;
  let blog2: BlogViewModel;
  let blog3: BlogViewModel;
  const prepareDto = (dto: BlogInputModel): BlogViewModel => {
    return {
      id: expect.any(String),
      name: dto.name.trim(),
      description: dto.description.trim(),
      websiteUrl: dto.websiteUrl.trim(),
    };
  };

  it('GET blogs should return 200', async function () {
    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual([]);
  });
  it('POST shouldn`t create blog with incorrect "data"', async () => {
    let dto: BlogInputModel = {
      name: '    ',
      description: 'description',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'name');

    dto = {
      name: 'valid name',
      description: 'description',
      websiteUrl: ' htt://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'websiteUrl');

    dto = {
      name: 'valid name',
      description: '        ',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'description');

    dto = {
      // @ts-ignore
      name: 1,
      description: 'description',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'name');

    dto = {
      name: 'valid name',
      description: 'description',
      // @ts-ignore
      websiteUrl: 1,
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'websiteUrl');

    dto = {
      name: 'valid name',
      // @ts-ignore
      description: 1,
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'description');

    // @ts-ignore
    dto = {
      description: 'description',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'name');

    // @ts-ignore
    dto = {
      name: 'valid name',
      description: 'description',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'websiteUrl');

    // @ts-ignore
    dto = {
      name: 'valid name',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'description');

    dto = {
      name: 'a'.repeat(16),
      description: 'description',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'name');

    dto = {
      name: 'valid name',
      description: 'a'.repeat(501),
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'description');

    dto = {
      name: 'valid name',
      description: 'description',
      websiteUrl: 'https://localhost1.uuu/blogs' + 'a'.repeat(100),
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, 'websiteUrl');

    dto = {
      name: '    ',
      description: '      ',
      websiteUrl: 'https://localhost1.uuu/blogs' + 'a'.repeat(100),
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.BAD_REQUEST_400, ['name', 'description', 'websiteUrl']);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual([]);
  });
  it('POST shouldn`t create blog without authorize', async () => {
    let dto: BlogInputModel = {
      name: ' NEW NAME   ',
      description: 'description   ',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    await HelpersForTests.createBlog(dto, HTTP_Status.UNAUTHORIZED_401);

    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual([]);
  });
  it('POST should create 3 blogs', async () => {
    let dto: BlogInputModel = {
      name: ' NEW NAME   ',
      description: 'description   ',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    let result = await HelpersForTests.createBlog(dto);
    if (result) blog1 = result;

    expect(blog1).toEqual(prepareDto(dto));

    dto = {
      name: 'what name 2  ',
      description: 'adescription  2',
      websiteUrl: ' https://localhost1.uuu/blogs2  ',
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog2 = result;

    expect(blog2).toEqual(prepareDto(dto));

    dto = {
      name: '  user2 blog  ',
      description: 'description  3',
      websiteUrl: ' https://localhost1.uuu/blogs3  ',
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog3 = result;

    expect(blog3).toEqual(prepareDto(dto));
  });
  it('GET blog by id should return blog', async function () {
    const blog = await HelpersForTests.findBlog(blog1.id);
    expect(blog).toEqual(blog1);
  });
  it('GET blog by bad id should return 404', async function () {
    await HelpersForTests.findBlog('1', HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.findBlog('9f38bedb-370a-47d0-9ef1-42f6294a1478', HTTP_Status.NOT_FOUND_404);
  });
  it('GET blogs should return 200', async function () {
    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual([blog1, blog2, blog3]);
  });
});
