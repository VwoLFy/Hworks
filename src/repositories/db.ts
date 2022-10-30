import 'dotenv/config'
import {MongoClient, ObjectId} from "mongodb"

const mongoUri = process.env.MONGOURI || 'mongodb://0.0.0.0:27017';
export const client = new MongoClient(mongoUri)

export type TypeBlogDB = {
    _id: ObjectId
    name: string
    youtubeUrl: string
    createdAt: string
};
export type TypePostDB = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

const db = client.db("Homework-3");
export const blogCollection = db.collection<TypeBlogDB>("blogs");
export const postCollection = db.collection<TypePostDB>("posts");

export async function runDb() {
    try {
        await client.connect();
        await client.db("blogs").command({ ping: 1 });
        await client.db("posts").command({ ping: 1 });
        console.log("Connected to DB")
    } catch (err) {
        console.log("!!! Can`t connect to DB !!!")
        await client.close()
    }
}