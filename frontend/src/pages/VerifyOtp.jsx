import { useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";
function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email);
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email || !otp) {
            Swal.fire({
                title: "please enter both email and otp",
                icon: "error",
            });
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/verify-otp",
                { email, otp }
            );
            Swal.fire({
                title: "Email Verified",
                text: response.data.message || "Email verified successfully",
                icon: "success",
            }).then(() => {
                navigate("/login");

            });
        } catch (error) {
            Swal.fire({
                title: "Verification Failed",
                text: error.response?.data?.message || "Invalid OTP code",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // resend Otp
    const resendOtp = async () => {
        if (!email) {
            Swal.fire({ title: "Error", text: "Please enter your email", icon: "error" });
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/api/resend-otp", {
                email
            });
            Swal.fire({
                title: "OTP Sent",
                text: response.data.message || "New OTP sent to your email",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to resend OTP",
                icon: "error",
            });
        }
    };
    return (
        <div className="bg-gradient-to-r from-green-300 via-blue-200 to-sky-300 min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Verify Email
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Enter the 6-digit OTP sent to your email
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
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
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="e.g. 123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full block  mb-4 px-4 py-2 text-center tracking-widest text-xl font-bold border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
<hr />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700 transition duration-200"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>

                </form>

                <div className="text-center mt-5 space-y-2">

                    <button
                        type="button"
                        onClick={resendOtp}
                        className="text-sky-600 text-sm font-semibold hover:underline"
                    >
                        Resend OTP
                    </button>

                    <div>
                        <Link
                            to="/register"
                            className="text-gray-500 text-sm hover:underline"
                        >
                            Back to Register
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
};
export default VerifyOtp;
