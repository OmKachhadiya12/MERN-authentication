import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    verifyOTP: {
        type: String,
        default: ""
    },
    verifyOTPExpiryAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOTP: {
        type: String,
        default: ""
    },
    resetOTPExpiryAt: {
        type: Number,
        default: 0
    }
},{timestamps: true});

const User = mongoose.model.User || mongoose.model("User",userSchema);

export default User;