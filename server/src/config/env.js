import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT || 8000,

    NODE_ENV: process.env.NODE_ENV || "development",

    CORS_ORIGIN: process.env.CORS_ORIGIN,

    DATABASE_URL: process.env.DATABASE_URL,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
}

export default env;