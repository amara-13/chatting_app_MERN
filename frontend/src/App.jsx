import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChatUser from "./pages/Chat";
import { useEffect } from "react";
import { socket } from "./socket";
function App() {
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });
    }, []);
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <ChatUser />
                    </ProtectedRoute>
                }
                />
                <Route path="/users" element={<Users />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;
