import helpersForTests from '../Utils/HelpersForTests';
import HelpersForTests from '../Utils/HelpersForTests';
import { HTTP_Status } from '../../src/enums';
import { CreatePostDto, PostViewModel, UpdatePostDto } from '../../src/repositories/posts-repository';
import { BlogViewModel, CreateBlogDto } from '../../src/repositories/blogs-repository';

describe('Public-    posts', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  let blog1: BlogViewModel;
  let post1: PostViewModel;
  let post2: PostViewModel;
  let post3: PostViewModel;
  const prepareDto = (dto: CreatePostDto): PostViewModel => {
    return {
      id: expect.any(String),
      title: dto.title.trim(),
      shortDescription: dto.shortDescription.trim(),
      content: dto.content.trim(),
      blogId: dto.blogId,
      blogName: expect.any(String),
    };
  };

  it('Create blog ', async function () {
    let dto: CreateBlogDto = {
      name: ' NEW NAME   ',
      description: 'description   ',
      websiteUrl: ' https://localhost1.uuu/blogs  ',
    };
    let result = await HelpersForTests.createBlog(dto);
    if (result) blog1 = result;
  });

  it('GET posts should return 200', async function () {
    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([]);
  });
  it('POST shouldn`t create post with incorrect "data"', async () => {
    let dto: CreatePostDto = {
      title: ' ',
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      // @ts-ignore
      title: 1,
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      title: 'a'.repeat(31),
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'title');

    // @ts-ignore
    dto = {
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      title: 'valid title',
      content: '  ',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      // @ts-ignore
      content: 1,
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      content: 'a'.repeat(1001),
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'content');

    // @ts-ignore
    dto = {
      title: 'valid title',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: '  ',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: 'valid content',
      // @ts-ignore
      shortDescription: 1,
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'a'.repeat(101),
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    // @ts-ignore
    dto = {
      title: 'valid title',
      content: 'valid content',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: '',
      shortDescription: '    ',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, ['content', 'shortDescription']);

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'some shortDescription',
      // @ts-ignore
      blogId: 1,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'blogId');

    // @ts-ignore
    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'some shortDescription',
    };
    await HelpersForTests.createPost(dto, HTTP_Status.BAD_REQUEST_400, 'blogId');

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([]);
  });
  it('POST shouldn`t create post without authorize', async () => {
    let dto: CreatePostDto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.createPost(dto, HTTP_Status.UNAUTHORIZED_401);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([]);
  });
  it('POST should create 3 posts', async () => {
    let dto: CreatePostDto = {
      title: 'valid title 1',
      content: 'valid content 1',
      shortDescription: 'some shortDescription 1',
      blogId: blog1.id,
    };
    let result = await HelpersForTests.createPost(dto);
    if (result) post1 = result;

    expect(post1).toEqual(prepareDto(dto));

    dto = {
      title: 'valid title 2',
      content: 'valid content 2',
      shortDescription: 'some shortDescription 2',
      blogId: blog1.id,
    };
    result = await HelpersForTests.createPost(dto);
    if (result) post2 = result;

    expect(post2).toEqual(prepareDto(dto));

    dto = {
      title: 'valid title 3',
      content: 'valid content 3',
      shortDescription: 'some shortDescription 3',
      blogId: blog1.id,
    };
    result = await HelpersForTests.createPost(dto);
    if (result) post3 = result;

    expect(post3).toEqual(prepareDto(dto));
  });
  it('GET post by id should return post', async function () {
    const post = await HelpersForTests.findPostById(post1.id);
    expect(post).toEqual(post1);
  });
  it('GET post by bad id should return 404', async function () {
    await HelpersForTests.findPostById('-1', HTTP_Status.NOT_FOUND_404);
  });
  it('GET posts should return 200', async function () {
    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([post1, post2, post3]);
  });
  it('PUT shouldn`t update post with incorrect data', async () => {
    let dto: UpdatePostDto = {
      title: ' ',
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      // @ts-ignore
      title: 1,
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      title: 'a'.repeat(31),
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'title');

    // @ts-ignore
    dto = {
      content: 'valid content',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'title');

    dto = {
      title: 'valid title',
      content: '  ',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      // @ts-ignore
      content: 1,
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      content: 'a'.repeat(1001),
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'content');

    // @ts-ignore
    dto = {
      title: 'valid title',
      shortDescription: 'some shortDescription',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'content');

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: '  ',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: 'valid content',
      // @ts-ignore
      shortDescription: 1,
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'a'.repeat(101),
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    // @ts-ignore
    dto = {
      title: 'valid title',
      content: 'valid content',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'shortDescription');

    dto = {
      title: 'valid title',
      content: '',
      shortDescription: '    ',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, ['content', 'shortDescription']);

    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'some shortDescription',
      // @ts-ignore
      blogId: 1,
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'blogId');

    // @ts-ignore
    dto = {
      title: 'valid title',
      content: 'valid content',
      shortDescription: 'some shortDescription',
    };
    await HelpersForTests.updatePost(post1.id, dto, HTTP_Status.BAD_REQUEST_400, 'blogId');

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([post1, post2, post3]);
  });
  it('PUT shouldn`t update not existing post', async () => {
    const dto: UpdatePostDto = {
      title: 'Updating title 1',
      content: 'Updating content 1',
      shortDescription: 'Updating shortDescription 1',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost('post1.id', dto, HTTP_Status.NOT_FOUND_404);
  });
  it('PUT shouldn`t update without authorize', async () => {
    const dto: UpdatePostDto = {
      title: 'Updating title 1',
      content: 'Updating content 1',
      shortDescription: 'Updating shortDescription 1',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost('post1.id', dto, HTTP_Status.UNAUTHORIZED_401);
  });
  it('PUT should update post with correct data', async () => {
    const oldPost1 = { ...post1 };

    const dto: UpdatePostDto = {
      title: 'Updating title 1',
      content: 'Updating content 1',
      shortDescription: 'Updating shortDescription 1',
      blogId: blog1.id,
    };
    await HelpersForTests.updatePost(post1.id, dto);

    const result = await HelpersForTests.findPostById(post1.id);
    if (result) post1 = result;

    expect(post1).toEqual({ ...prepareDto(dto), id: post1.id });
    expect(post1).not.toEqual(oldPost1);
  });
  it('DELETE shouldn`t delete post without authorize', async () => {
    await HelpersForTests.deletePost(post1.id, HTTP_Status.UNAUTHORIZED_401);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([post1, post2, post3]);
  });
  it('DELETE should delete post', async () => {
    await HelpersForTests.deletePost(post1.id);
    await HelpersForTests.findPostById(post1.id, HTTP_Status.NOT_FOUND_404);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([post2, post3]);
  });
  it('DELETE shouldn`t delete post with incorrect "id"', async () => {
    await HelpersForTests.deletePost('post1.id', HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.deletePost('9f38bedb-370a-47d0-9ef1-42f6294a1478', HTTP_Status.NOT_FOUND_404);
    await HelpersForTests.deletePost(post1.id, HTTP_Status.NOT_FOUND_404);

    const posts = await HelpersForTests.findPosts();
    expect(posts).toEqual([post2, post3]);
  });
});
