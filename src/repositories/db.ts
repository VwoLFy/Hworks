import {MongoClient} from "mongodb"
import {TypeNewBlog} from "../domain/blogs-service";
import {TypeNewPost} from "../domain/posts-service";
import {TypeNewUser} from "../domain/user-service";
import {settings} from "../settings";
import {TypeNewComment} from "../domain/comments-service";

const mongoUri = process.env.NODE_ENV === "test" ? settings.MONGO_URI_LOC : settings.MONGO_URI;
export const client = new MongoClient(mongoUri)

type TypeBlogDB = TypeNewBlog
type TypePostDB = TypeNewPost
type TypeUserDB = TypeNewUser
type TypeCommentDB = TypeNewComment

const db = client.db("Homework");
export const blogCollection = db.collection<TypeBlogDB>("blogs");
export const postCollection = db.collection<TypePostDB>("posts");
export const userCollection = db.collection<TypeUserDB>("users");
export const commentCollection = db.collection<TypeCommentDB>("comments");

export async function runDb() {
    try {
        await client.connect();
        await client.db("blogs").command({ ping: 1 });
        console.log("Connected to DB")
    } catch (err) {
        console.log("!!! Can`t connect to DB !!!")
        await client.close()
    }
}