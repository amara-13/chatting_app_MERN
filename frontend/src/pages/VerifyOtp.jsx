import { useState } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";
import { Mail, KeyRound, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

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
                title: "Incomplete details",
                text: "Please enter both email and OTP code",
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
                timer: 1500,
                showConfirmButton: false,
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
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-[#FAF5FF]">
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#FDA4AF] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#99F6E4] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />
            <div className="absolute top-10 right-10 w-60 h-60 bg-[#FED7AA] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />

            <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-[#C4B5FD]/10 border border-[#C4B5FD]/40 p-8 sm:p-10">
                <div className="text-center mb-7">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] to-[#C4B5FD] text-[#1E1B4B] flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#FDA4AF]/25">
                        <CheckCircle2 className="w-7 h-7 bg-danger-400 text-[#1E1B4B]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                        Verify Email
                    </h2>
                    <p className="text-xs sm:text-sm text-[#1E1B4B]/70 mt-1.5">
                        Enter the 6-digit confirmation code sent to your email
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] rounded-xl border border-[#C4B5FD]/40 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40 outline-none transition text-[#1E1B4B]"
                                required
                            />
                        </div>
                    </div>

                    {/* OTP Input */}
                    <div>
                        <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            6-Digit OTP Code
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-center tracking-widest text-lg font-bold bg-[#FAF5FF] rounded-xl border border-[#C4B5FD]/40 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40 outline-none transition text-[#1E1B4B]"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDA4AF] to-[#FED7AA] hover:opacity-95 disabled:opacity-60 text-[#1E1B4B] py-3 rounded-2xl font-bold text-sm shadow-md shadow-[#FDA4AF]/25 transition-all cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Verify Email</span>
                        )}
                    </button>
                </form>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#C4B5FD]/30 text-xs">
                    <button
                        type="button"
                        onClick={resendOtp}
                        className="font-bold text-[#1E1B4B] hover:text-[#FDA4AF] cursor-pointer"
                    >
                        Resend Code
                    </button>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-1 font-bold text-[#1E1B4B]/70 hover:text-[#1E1B4B]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Register</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerifyOtp;
