import 'dotenv/config'

export const settings = {
    MONGO_URI: process.env.MONGOURI || 'mongodb://0.0.0.0:27017', //для локальной базы
    //MONGO_URI: process.env.MONGOURI_A || 'mongodb://0.0.0.0:27017', //для облачной базы
    JWT_SECRET: process.env.JWT_SECRET || "12345"
}