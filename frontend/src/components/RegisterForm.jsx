import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Loader2, MessageCircleHeart } from "lucide-react";

function RegisterForm({ handleSubmit, loading, handleChange, formData, errors = {} }) {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-8 bg-[#FAF5FF]">
            {/* Pastel ambient glows */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#FDA4AF] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#99F6E4] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />
            <div className="absolute top-10 right-10 w-60 h-60 bg-[#FED7AA] blur-3xl -z-10 rounded-full pointer-events-none opacity-40" />

            <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-[#C4B5FD]/10 border border-[#C4B5FD]/40 p-8 sm:p-10 transition-all">
                
                {/* Header */}
                <div className="text-center mb-7">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FDA4AF] to-[#C4B5FD] text-[#1E1B4B] flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#FDA4AF]/25">
                        <MessageCircleHeart className="w-7 h-7 text-[#1E1B4B]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
                        Join Chatto
                    </h2>
                    <p className="text-xs sm:text-sm text-[#1E1B4B]/70 mt-1.5">
                        Create an account to chat and connect with friends
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input 
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] rounded-xl border transition-all outline-none text-[#1E1B4B] ${
                                    errors.name 
                                        ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200" 
                                        : "border-[#C4B5FD]/50 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40"
                                }`} 
                            />
                        </div>
                        {errors.name && (
                            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input 
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] rounded-xl border transition-all outline-none text-[#1E1B4B] ${
                                    errors.email 
                                        ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200" 
                                        : "border-[#C4B5FD]/50 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40"
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input 
                                id="password"
                                type="password"
                                name="password"
                                placeholder="8+ chars (1 uppercase, 1 digit, 1 symbol)"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] rounded-xl border transition-all outline-none text-[#1E1B4B] ${
                                    errors.password 
                                        ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200" 
                                        : "border-[#C4B5FD]/50 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40"
                                }`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmpassword" className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4B5FD]" />
                            <input
                                id="confirmpassword"
                                type="password"
                                name="confirmpassword"
                                placeholder="Re-enter password"
                                value={formData.confirmpassword}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] rounded-xl border transition-all outline-none text-[#1E1B4B] ${
                                    errors.confirmpassword 
                                        ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-200" 
                                        : "border-[#C4B5FD]/50 focus:bg-white focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#99F6E4]/40"
                                }`}
                            />
                        </div>
                        {errors.confirmpassword && (
                            <p className="text-rose-500 text-xs mt-1 font-medium">{errors.confirmpassword}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDA4AF] to-[#FED7AA] hover:opacity-95 active:scale-[0.99] disabled:opacity-60 text-[#1E1B4B] py-3 rounded-2xl font-bold text-sm shadow-md shadow-[#FDA4AF]/25 transition-all duration-200 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Chatto Account</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                </form>

                {/* Footer link to Login */}
                <div className="text-center pt-6 mt-6 border-t border-[#C4B5FD]/30 text-xs text-[#1E1B4B]/80">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-[#1E1B4B] underline hover:text-[#FDA4AF]">
                        Sign in here
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default RegisterForm;