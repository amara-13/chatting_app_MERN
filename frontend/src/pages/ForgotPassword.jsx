import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { forgotPassword } from "../services/AuthService";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire({ icon: "warning", title: "Please enter your email" });
            return;
        }

        setLoading(true);

        try {
            const data = await forgotPassword(email);

            Swal.fire({
                icon: "success",
                title: "OTP Sent!",
                text: data.message || "Please check your email for the OTP.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                // Navigate to ResetPassword page passing the email in route state
                navigate("/reset-password", { state: { email } });
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to Send OTP",
                text: error.response?.data?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-green-300 via-blue-200 to-sky-300 min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                    <p className="text-gray-500 mt-1 text-sm">
                        Enter your registered email address to receive an OTP
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOtp} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700 transition duration-200"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-5">
                    <Link to="/login" className="text-sky-600 text-sm font-semibold hover:underline">
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword;
