const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!*?&]).{8,}$/;

const userRegister = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (name, email, password)."
            });

        }
        const emailRegrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegrex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters and contain an uppercase letter, a number, and a special character."

            });
        }

        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists."
            });
        }
        //generate otp 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const hashPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashPassword,
            otp: otp,
            otpExpiresAt: otpExpiresAt,
            isVerified: false,
        });
        await sendOtpEmail(user.email, otp);
        return res.status(201).json({
            success: true,
            message: "user registered.Please check your email for OTP verification code",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//  verify otp
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "email and otp required"

            });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }
        // if (user.isVerified) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Email is already verified"
        //     });
        // }
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "otp does not match",
            });

        }
        if (new Date() > new Date(user.otpExpiresAt)) {
            return res.status(400).json({
                success: false,
                message: "otp has expired. please request new one"
            });
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
        // const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            token,
            data: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// otp resend
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "email not found"
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
        await sendOtpEmail(user.email, otp);
        return res.status(200).json({
            success: true,
            message: "Otp resend successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
//login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "password and email must required",

            });

        }
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",

            });
        }
        //Generate token


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            message: "user login successfullly",
            token: token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "failed to login user"
        });
    }
}

// forget password | change change password | reset password
const resetOtp = async (req,res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json
                ({
                    success: false,
                    message: "Email is required."
                });
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No account found with this email."
            })
        }
        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 10000);

        user.resetOtp = resetOtp;
        user.resetOtpExpiresAt = otpExpiresAt;
        await user.save();
        await sendOtpEmail(user.email, resetOtp);

        return res.status(200).json({
            success: true,
            message: "Password reset OTP has been sent to your email.",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }


}
//  verify reset otp
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and new password are required."

            });
        }
            const user = await User.findOne({ email: email.toLowerCase().trim() });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "No account found with this email."
                });
            }
            if (user.resetOtp !== otp) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP."

                });
            }
            if (Date.now() > new Date(user.resetOtpExpiresAt)) {
                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please request a new one."
                });

            }
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters and contain an uppercase letter, a number, and a special character.",
                });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetOtp = null;
            user.resetOtpExpiresAt = null;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password reset successfully. You can now log in.",
            });
        }
        catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    }



module.exports = {
    userRegister,
    userLogin,
    verifyOtp,
    resendOtp,
    resetOtp,
    resetPassword
};
