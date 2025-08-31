import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./../models/User.model.js";
import transporter from "../config/nodemailer.js";

export const register = async(req,res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false,message: "Missing details!!!"});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.json({success: false,message: "Email already exist."});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({name,email,password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "7d"});

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        res.cookie("token",token,options);

        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to my Website!!!",
            text: `Your account has been in created with Email-id: ${email} in Hanuman website.`
        }

        await transporter.sendMail(mailoptions);

        return res.json({success: true});

    }catch(error) {
        res.json({success: false,message: error.message});
    }
}

export const login = async(req,res) => {
    const {email,password} = req.body;

    if(!email || !password) {
        return res.json({success: false,message: "Email and Password are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.json({success: false,message: "Email or Password is Incorrect."});
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch) {
            return res.json({success: false,message: "Email or Password is Incorrect."});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "7d"});

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        res.cookie("token",token,options);

        return res.json({success: true});

    }catch(error) {
        res.json({success: false,message: error.message});
    }

}

export const logout = async(req,res) => {
    try{
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.clearCookie("token",options);

        return res.json({success: true,message: "Logged out successfully."}); 

    }catch(error) {
        res.json({success: false,message: error.message});
    }
}

export const sendVerifyOTP = async(req,res) => {
    try{
        const {userId} = req.body;

        const user = await User.findById(userId);
        if(user.isAccountVerified) {
            return res.json({success: false,message: "Your account is already Verified."});
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOTP = OTP;
        user.verifyOTPExpiryAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account verification OTP",
            to: `Your OTP is ${OTP}.Verify your account using this OTP.`
        }

        await transporter.sendMail(mailoptions);

        return res.json({success: true,message: `Verification OTP sent on this Email-id ${user.email}`});



    }catch(error){
        res.json({success: false,message: error.message});
    }
}

export const verifyEmail = async(req,res) => {
    try{
        const {userId,OTP} = req.body;
        const user = await User.findById(userId);

        if(!user || !OTP) {
            return res.json({success: false,message: "Missing OTP."});
        }

        if(!user) {
            return res.json({success: false,message: "Please register!!!"});
        }

        if(user.verifyOTP !== OTP) {
            return res.json({success: true,message: "OTP is Incorrect."});
        }

        if(user.verifyOTPExpiryAt < Date.now) {
            return res.json({success: false,message: "OTP is Expired."});
        }

        user.isAccountVerified = true;
        user.verifyOTP = "";
        user.verifyOTPExpiryAt = 0;

        await user.save();

        return res.json({success: false,message: "Your account is Verified. "})

    }catch(error) {
        res.json({success: false,message: error.message});
    }
}