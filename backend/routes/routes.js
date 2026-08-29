const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const { userRegister, userLogin, verifyOtp,resendOtp, resetOtp, resetPassword} = require("../controllers/authController");

// User Registration
router.post("/register", userRegister);
router.post("/login", userLogin)
router.post("/verify-otp", verifyOtp)
router.post("/resend-otp", resendOtp)
router.post("/forgot-password",resetOtp);
router.post("/reset-password",resetPassword);
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });

});


module.exports = router;
