import axios from "axios";

const AUTH_API_URL = "http://localhost:5000/api";

export const register = async (userData) => {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
};
export const login = async (userData)=>{
    const response = await axios.post(`${AUTH_API_URL}/login`, userData);
 return response.data;
} ;
export const getProfile = async()=>{
    const token = localStorage.getItem("token");
    const response = await
    axios.get(`${AUTH_API_URL}/profile`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    return response.data.user;
}
 export const forgotPassword = async(email)=>{
    const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
    return response.data;
 };
 export const resetPassword = async(data)=>{
    const response = await axios.post(`${AUTH_API_URL}/reset-password`,data);
    return response.data;
 };
