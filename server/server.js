import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(cookieParser());
app.use(cors({origins: allowedOrigins, credentials: true}));
app.use(express.json());

app.get("/",(req,res) => {
    res.send("Hey!!!");
})
app.use("/auth",authRoutes);
app.use("/user",userRoutes);

app.listen(PORT,() => {console.log(`Server is listioning on ${PORT}`)});