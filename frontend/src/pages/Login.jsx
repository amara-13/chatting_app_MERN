
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import Swal from "sweetalert2";
import {login} from "../services/AuthService";
import { useNavigate } from "react-router-dom"; 

function Login (){
 const navigate = useNavigate();
 const [loading,setLoading] = useState(false);
const [errors,setErrors] = useState({});
const [formData, setFormData] = useState({
    email:"",
    password:"",
});
 const handleChange = (e)=>{
    const{name,value} = e.target;
    setFormData({
        ...formData,
    [name]:value,
    });
 }
 const formValidation = ()=>{
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    
    if(!formData.email.trim()){
        newErrors.email = "email is required";

    }else if(!emailRegex.test(formData.email)){
        newErrors.email = "Please enter a valid email address";
    } 
    if(!formData.password.trim()){
        newErrors.password = "password is required";
    }else if (!passwordRegex.test(formData.password)){
        newErrors.password = "Must be 8+ chars with 1 uppercase, 1 number, and 1 symbol."
    }
 setErrors(newErrors);
 return Object.keys(newErrors).length===0;
}
 const handleSubmit =async (e)=>{

    e.preventDefault();
    if(!formValidation())
        return;
    try{
        setLoading(true);
    const response = await login(formData);
    
    setFormData({
        email:"",
        password:"",
    });
    if(response.token){
        localStorage.setItem("token",response.token);
        console.log(response.token);
        localStorage.setItem ("user",JSON.stringify(response.data));
    }
    Swal.fire({
        title:"login Successfully",
        text:response.message || "User login Successfully",
        icon:"success"
    }).then(()=>{
        // navigate("/profile");
        window.location.href="/profile";
    });
}catch(error){
    const errorMsg = error.response?.data?.message|| error.message;
    Swal.fire({
        title:"Login Failed",
        text:errorMsg,
        icon:"error"
    });
}finally{
    setLoading(false);
}
    
    
 }


return (
    <LoginForm formData={formData} handleChange={handleChange} handleSubmit = {handleSubmit} errors={errors} loading={loading}/>
);
}
export default Login;
