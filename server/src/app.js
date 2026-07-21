import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import ApiError from "./utils/ApiError.js";
import errorHandler from "./middlewares/error.middleware.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// CORS
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
}));

// Middlewares
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({
    extended: false,
    limit: "16kb",
}));

app.use(cookieParser());

// Routes
app.use("/api/v1", indexRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

export default app;