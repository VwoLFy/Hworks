import 'dotenv/config'

export const settings = {
    MONGO_URI_LOC: process.env.MONGOURI_LOC || 'mongodb://0.0.0.0:27017/', //для локальной базы
    //MONGO_URI: process.env.MONGOURI_A || 'mongodb://0.0.0.0:27017/', //для облачной базы
    MONGO_URI: process.env.MONGOURI || 'mongodb://0.0.0.0:27017/', //для локальной базы
    JWT_SECRET: process.env.JWT_SECRET || "12345",
    JWT_SECRET_FOR_REFRESHTOKEN: process.env.JWT_SECRET_FOR_REFRESHTOKEN || "1234567",
    EMAIL_PASS: process.env.EMAIL_PASSWORD,
    E_MAIL: process.env.EMAIL,
    TEST_EMAIL: process.env.MY_EMAIL
}