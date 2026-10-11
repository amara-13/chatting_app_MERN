import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    let user = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored) user = JSON.parse(stored);
    } catch (e) {
        user = null;
    }

    const [dropdown, setDropdown] = useState(false);

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return "C";
        const parts = name.trim().split(" ");
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    };

    // Logout
    const handleLogout = () => {
        setDropdown(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        }).then(() => {
            navigate("/login");
        });
    };

    return (
        <nav className="w-full bg-white border-b border-[#C4B5FD]/40 px-6 py-3 flex items-center justify-between shadow-xs">
            {/* Logo */}
            <Link to="/" className="text-2xl font-extrabold text-[#1E1B4B] flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FDA4AF] inline-block"></span>
                <span>Chatto</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-5">
                <Link to="/" className="text-sm font-semibold text-[#1E1B4B]/80 hover:text-[#1E1B4B] transition">
                    Home
                </Link>

                {token && (
                    <>
                        <Link to="/users" className="text-sm font-semibold text-[#1E1B4B]/80 hover:text-[#1E1B4B] transition">
                            Users
                        </Link>
                        <Link to="/chat" className="text-sm font-semibold text-[#1E1B4B]/80 hover:text-[#1E1B4B] transition">
                            Chat
                        </Link>
                    </>
                )}

                {/* Logged Out */}
                {!token && (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-semibold text-[#1E1B4B]/80 hover:text-[#1E1B4B] transition">
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="text-sm font-bold text-[#1E1B4B] bg-[#FDA4AF] hover:bg-[#FDA4AF]/90 px-4 py-1.5 rounded-full shadow-xs transition"
                        >
                            Register
                        </Link>
                    </div>
                )}

                {/* Logged In Dropdown */}
                {token && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDropdown(!dropdown)}
                            className="w-9 h-9 rounded-full bg-[#C4B5FD] text-[#1E1B4B] font-bold text-sm flex items-center justify-center border-2 border-[#FDA4AF] hover:opacity-90 transition cursor-pointer"
                        >
                            {getInitials(user?.name)}
                        </button>

                        {dropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#C4B5FD]/40 rounded-2xl shadow-lg z-50 py-2">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-bold text-[#1E1B4B] truncate">{user?.name || "User"}</p>
                                    <p className="text-[11px] text-gray-500 truncate">{user?.email || ""}</p>
                                </div>
                                <Link
                                    to="/users"
                                    onClick={() => setDropdown(false)}
                                    className="block px-4 py-2 text-xs font-semibold text-[#1E1B4B] hover:bg-[#FAF5FF] transition"
                                >
                                    Find Friends
                                </Link>
                                <Link
                                    to="/chat"
                                    onClick={() => setDropdown(false)}
                                    className="block px-4 py-2 text-xs font-semibold text-[#1E1B4B] hover:bg-[#FAF5FF] transition"
                                >
                                    Chat
                                </Link>
                                <hr className="border-gray-100 my-1" />
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
