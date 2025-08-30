import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./../models/User.model.js"

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