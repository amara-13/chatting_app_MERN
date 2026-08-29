import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword } from "../services/AuthService";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email || !otp || !newPassword) {
            Swal.fire({
                icon: "warning",
                title: "All fields are required",
                text: "Please enter your email, OTP, and new password.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords do not match",
                text: "Please make sure both password fields match.",
            });
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.",
            });
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword({
                email,
                otp,
                newPassword,
            });

            Swal.fire({
                icon: "success",
                title: "Password Reset Successfully",
                text: data.message || "You can now log in with your new password.",
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text: error.response?.data?.message || "Failed to reset password. Please check your OTP.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-green-300 via-blue-200 to-sky-300 min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 mt-1 text-sm">
                        Enter the OTP sent to your email and choose a new password
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            6-Digit OTP
                        </label>
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="e.g. 123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 text-center tracking-widest text-lg font-bold border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    {/* New Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 text-white py-2.5 rounded-md font-semibold hover:bg-sky-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>

                <div className="text-center mt-5 space-y-2">
                    <div>
                        <Link
                            to="/forgot-password"
                            className="text-sky-600 text-sm font-semibold hover:underline"
                        >
                            Resend Reset OTP
                        </Link>
                    </div>
                    <div>
                        <Link
                            to="/login"
                            className="text-gray-500 text-sm hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
