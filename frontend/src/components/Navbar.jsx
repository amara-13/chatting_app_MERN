import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const [dropdown, setdropdown] = useState(false);

    // helper for for name abbriviation
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        return parts.length >= 2 ? (parts[0][0] + parts[1][0].toUpperCase()) : name.slice(0, 2).toUpperCase();
    };

    // logout handle
    const handleLogout = () => {
        setdropdown(false);
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
        <nav className="w-full bg-white border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-emerald-600">
                MyApp</Link>
            <div className="flex items-center gap-4">
                {/* Home is always visible */}
                <Link
                    to="/"
                    className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
                >
                    Home
                </Link>
                {!token && (
                    <>
                        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition">
                            Login
                        </Link>
                        <Link to="/register" className="text-sm font-medium bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition">
                            Register
                        </Link>
                    </>

                )}
                {token && (
                    <div className="relative">
                        <button onClick={() => setdropdown((prev) => !prev)}
                            className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center border-2 border-emerald-300 hover:border-emerald-500 transition focus:outline-none">
                            {getInitials(user?.name)}
                        </button>
                        {dropdown && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                                <Link to="/profile" onClick={() => setdropdown(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Profile
                                </Link>
                                <hr className="border-slate-100 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                >Logout</button>
                            </div>

                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
export default Navbar;
