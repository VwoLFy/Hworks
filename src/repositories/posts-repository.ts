import { postCollection, PostDBType } from './db';
import { ObjectId } from 'mongodb';
import { PostType } from '../domain/posts-service';
import { converters } from './converters';

export const postsRepository = {
  async findPostById(id: string): Promise<PostType | null> {
    const foundPost = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!foundPost) return null;

    return converters._id<PostDBType, PostType>(foundPost);
  },

  async createPost(post: PostType): Promise<void> {
    const postDB = converters.id<PostType, PostDBType>(post);

    const result = await postCollection.insertOne(postDB);
    if (!result.acknowledged) throw new Error('Can`t create');
  },

  async updatePost(post: PostType): Promise<boolean> {
    const { id, ...data } = post;
    const result = await postCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return result.matchedCount !== 0;
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount !== 0;
  },

  async deleteAll() {
    await postCollection.deleteMany({});
  },
};
