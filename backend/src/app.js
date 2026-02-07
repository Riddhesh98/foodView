import express from "express";

import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    credentials: true
}))

app.use(cookieParser()) // Enable cookie parsing for all routes

app.use(express.json()) // Enable JSON parsing for all routes

app.use(express.urlencoded({ extended: true })) // Enable URL-encoded data parsing for all routes






import userRoutes from "./routes/user.routes.js";
//routes
app.use("/api/auth", userRoutes);



export default app;