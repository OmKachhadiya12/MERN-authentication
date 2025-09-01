import express from "express";
const router = express.Router();
import { getUserData } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";

router.get("/getdata",userAuth,getUserData);

export default router;