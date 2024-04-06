import { ObjectId } from 'mongodb';
import { postCollection, PostDBType } from './db';
import { converters } from './converters';

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
  postWithReplaceId(object: PostDBType): PostViewModel {
    return converters._id<PostDBType, PostViewModel>(object);
  },
};
