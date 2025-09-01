import express from "express";
const router = express.Router();
import {login, logout, register,sendVerifyOTP,verifyEmail,isAuthenticated,sendResetOTP,resetPassword} from "./../controller/authCntroller.js";
import userAuth from "../middleware/userAuth.js";

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/sendVerifyOTP",userAuth,sendVerifyOTP);
router.post("/verifyEmail",userAuth,verifyEmail);
router.post("/isAuthenticated",userAuth,isAuthenticated);
router.post("/sendResetOTP",sendResetOTP);
router.post("/resetPassword",resetPassword); 

export default router;