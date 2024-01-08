import helpersForTests from '../Utils/HelpersForTests';
import { BlogInputModel, BlogViewModel } from '../../src/repositories/blogs-repository';
import { HTTP_Status } from '../../src/enums';
import HelpersForTests from '../Utils/HelpersForTests';

describe('Public-    blogs', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  let blog1: BlogViewModel;
  let blog2: BlogViewModel;
  let blog3: BlogViewModel;

  it('GET blogs should return 200', async function () {
    const blogs = await HelpersForTests.findBlogs();
    expect(blogs).toEqual([]);
  });
  it('Create 3 blogs', async () => {
    let dto: BlogInputModel = {
      name: ' NEW NAME   ',
      description: 'description   ',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    let result = await HelpersForTests.createBlog(dto);
    if (result) blog1 = result;

    expect(blog1).toEqual({
      id: expect.any(String),
      name: dto.name.trim(),
      description: dto.description.trim(),
      websiteUrl: dto.websiteUrl.trim(),
    });

    dto = {
      name: 'what name 2  ',
      description: 'adescription  2',
      websiteUrl: ' https://localhost1.uuu/blogs2  ',
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog2 = result;

    expect(blog2).toEqual({
      id: expect.any(String),
      name: dto.name.trim(),
      description: dto.description.trim(),
      websiteUrl: dto.websiteUrl.trim(),
    });

    dto = {
      name: '  user2 blog  ',
      description: 'description  3',
      websiteUrl: ' https://localhost1.uuu/blogs3  ',
    };
    result = await HelpersForTests.createBlog(dto);
    if (result) blog3 = result;

    expect(blog3).toEqual({
      id: expect.any(String),
      name: dto.name.trim(),
      description: dto.description.trim(),
      websiteUrl: dto.websiteUrl.trim(),
    });
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
