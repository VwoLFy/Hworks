import helpersForTests from '../Utils/HelpersForTests';
import request from 'supertest';
import { app } from '../../src';
import { BlogViewModel } from '../../src/repositories/blogs-repository';
import { HTTP_Status } from '../../src/enums';
import { blogsRoute } from '../../src/routes/routes';

describe('Public-    blogs', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  let blog1: BlogViewModel;
  let blog2: BlogViewModel;
  let blog3: BlogViewModel;

  it('GET blogs should return 200', async function () {
    await request(app).get(blogsRoute).expect(HTTP_Status.OK_200, []);
  });
  it('Create 2 blog by user1 and 1 blog by user2', async () => {
    let result = await request(app)
      .post(blogsRoute)
      .auth('admin', 'qwerty')
      .send({
        name: ' NEW NAME   ',
        description: 'description   ',
        websiteUrl: ' https://localhost1.uuu/blogs  ',
      })
      .expect(HTTP_Status.CREATED_201);
    blog1 = result.body;

    expect(blog1).toEqual({
      id: expect.any(String),
      name: 'NEW NAME',
      description: 'description',
      websiteUrl: 'https://localhost1.uuu/blogs',
    });
    result = await request(app)
      .post(blogsRoute)
      .auth('admin', 'qwerty')
      .send({
        name: 'what name 2  ',
        description: 'adescription  2',
        websiteUrl: ' https://localhost1.uuu/blogs2  ',
      })
      .expect(HTTP_Status.CREATED_201);
    blog2 = result.body;

    result = await request(app)
      .post(blogsRoute)
      .auth('admin', 'qwerty')
      .send({
        name: '  user2 blog  ',
        description: 'description  3',
        websiteUrl: ' https://localhost1.uuu/blogs3  ',
      })
      .expect(HTTP_Status.CREATED_201);
    blog3 = result.body;
  });
  it('GET blog by id should return blog', async function () {
    await request(app).get(`${blogsRoute}/${blog1.id}`).expect(HTTP_Status.OK_200, blog1);
  });
  it('GET blog by bad id should return 404', async function () {
    await request(app).get(`${blogsRoute}/1`).expect(HTTP_Status.NOT_FOUND_404);
    await request(app).get(`${blogsRoute}/9f38bedb-370a-47d0-9ef1-42f6294a1478`).expect(HTTP_Status.NOT_FOUND_404);
  });
  it('GET blogs should return 200', async function () {
    await request(app).get(blogsRoute).expect(HTTP_Status.OK_200, [blog1, blog2, blog3]);
  });
});
