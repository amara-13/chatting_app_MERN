import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { register } from "../services/AuthService";
import Swal from "sweetalert2";

function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };
    const formValidation = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please Enter a valid email Address";
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password  is required";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Must be 8+ chars with 1 uppercase, 1 number, and 1 symbol.";
        }

        if (!formData.confirmpassword) {
            newErrors.confirmpassword = "Confirm password is required";
        } else if (formData.password !== formData.confirmpassword) {
            newErrors.confirmpassword = " password do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formValidation()) return;

        try {

            const { confirmpassword, ...userData } = formData;
            setLoading(true);

            const response = await register(userData);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmpassword: ""
            });

            Swal.fire({
                title: "User Registered",
                text: response.message || "User Registered Successfully",
                icon: "success"
            }).then(() => {
                navigate("/verify-otp", {
                    state: {
                        email: response.data.email,
                    }
                }
                );
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("Registration Error:", errorMsg);
            Swal.fire({
                title: "Registration Failed",
                text: errorMsg,
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} loading={loading} errors={errors} />
    );
}

export default Register;

