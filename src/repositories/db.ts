import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import { BlogType } from '../domain/blogs-service';
import { PostType } from '../domain/posts-service';

const mongoUri = process.env.MONGOURI_A || 'mongodb://0.0.0.0:27017';
export const client = new MongoClient(mongoUri);

export type BlogDBType = Omit<BlogType, 'id'> & { _id: ObjectId };
export type PostDBType = Omit<PostType, 'id'> & { _id: ObjectId };

const db = client.db('Homework-3');
export const blogCollection = db.collection<BlogDBType>('blogs');
export const postCollection = db.collection<PostDBType>('posts');

export async function runDb() {
  try {
    await client.connect();
    await client.db('blogs').command({ ping: 1 });
    await client.db('posts').command({ ping: 1 });
    console.log('Connected to DB');
  } catch (err) {
    console.log('!!! Can`t connect to DB !!!');
    await client.close();
  }
}
