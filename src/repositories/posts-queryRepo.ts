import { ObjectId } from 'mongodb';
import { postCollection } from './db';

type TypePostFromDB = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export const postsQueryRepo = {
  async findPosts(): Promise<PostViewModel[]> {
    return (await postCollection.find({}).toArray()).map((foundPost) => this.postWithReplaceId(foundPost));
  },
  async findPostById(id: string): Promise<PostViewModel | null> {
    const foundPost = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!foundPost) {
      return null;
    } else {
      return this.postWithReplaceId(foundPost);
    }
  },
  postWithReplaceId(object: TypePostFromDB): PostViewModel {
    return {
      id: object._id.toString(),
      title: object.title,
      shortDescription: object.shortDescription,
      content: object.content,
      blogId: object.blogId,
      blogName: object.blogName,
      createdAt: object.createdAt,
    };
  },
};
