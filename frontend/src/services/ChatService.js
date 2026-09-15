import axios from "axios";
const url = "http://localhost:5000/api";

export const fetchUsers = async()=>{
    const response = await axios.get(`${url}/users`);
    return response.data;
};
export const sendMessageApi = async(data)=>{
    const response = await axios.post(`${url}/message`,data);
    return response.data;
};

export const fetchMessagesApi = async (senderId, receiverId) => {
    const response = await axios.get(`${url}/messages/${senderId}/${receiverId}`);
    return response.data;
};
