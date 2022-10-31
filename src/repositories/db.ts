import 'dotenv/config'
import {MongoClient} from "mongodb"
import {TypeNewBlog} from "../domain/blogs-service";
import {TypeNewPost} from "../domain/posts-service";

const mongoUri = process.env.MONGOURI || 'mongodb://0.0.0.0:27017';
export const client = new MongoClient(mongoUri)

export type TypeBlogDB = TypeNewBlog;
export type TypePostDB = TypeNewPost

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