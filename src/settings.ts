import 'dotenv/config'

export const settings = {
    //MONGO_URI: process.env.MONGOURI || 'mongodb://0.0.0.0:27017',
    MONGO_URI: 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || "12345"
}