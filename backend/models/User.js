const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,

        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpiresAt: {
            type: Date,
            default: null,
        },
        resetOtp:{
            type:String,
            default:null,
        },
        resetOtpExpiresAt:{
            type:Date,
            default:null
        },
        
    },
    {
        timestamps: true,
    },
);
const User = mongoose.model("User", userSchema);
module.exports = User;