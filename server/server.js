import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js";

import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(express.json());

app.use("/",router);

app.listen(PORT,() => {console.log(`Server is listioning on ${PORT}`)});