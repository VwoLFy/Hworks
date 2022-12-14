import {settings} from "../settings";
import mongoose from "mongoose";

const mongoUri = process.env.NODE_ENV === "test" ? settings.MONGO_URI_LOC : settings.MONGO_URI;
const dbName = "Homework"

export async function runDb() {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoUri, {dbName})
        console.log("Connected to DB")
    } catch (err) {
        console.log("!!! Can`t connect to DB !!!")
        await mongoose.disconnect()
    }
}