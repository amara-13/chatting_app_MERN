import axios from "axios";
const url = "http://localhost:5000/api";

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token || localStorage.getItem("token")}`
    }
});

export const fetchUsers = async () => {
    const response = await axios.get(`${url}/users`);
    return response.data;
};

export const sendMessageApi = async (data, token) => {
    const response = await axios.post(`${url}/message`, data, getAuthHeaders(token));
    return response.data;
};

export const fetchMessagesApi = async (senderId, receiverId, token) => {
    const response = await axios.get(`${url}/messages/${senderId}/${receiverId}`, getAuthHeaders(token));
    return response.data;
};

export const sendFriendRequestApi = async (data, token) => {
    const response = await axios.post(`${url}/friendrequest/send`, data, getAuthHeaders(token));
    return response.data;
};

export const getPendingRequestsApi = async (token) => {
    const response = await axios.get(`${url}/friendrequest/get`, getAuthHeaders(token));
    return response.data;
};

export const cancelFriendRequestApi = async (data, token) => {
    const response = await axios.patch(`${url}/friendRequest/cancel`, data, getAuthHeaders(token));
    return response.data;
};

export const unFriendRequestApi = async (data, token) => {
    const response = await axios.patch(`${url}/friendRequest/unfriend`, data, getAuthHeaders(token));
    return response.data;
};

export const acceptFriendRequestApi = async (data, token) => {
    const response = await axios.patch(`${url}/friendrequest/accept`, data, getAuthHeaders(token));
    return response.data;
};

export const rejectFriendRequestApi = async (data, token) => {
    const response = await axios.patch(`${url}/friendrequest/reject`, data, getAuthHeaders(token));
    return response.data;
};

export const getFriendApi = async (token) => {
    const response = await axios.get(`${url}/friends`, getAuthHeaders(token));
    return response.data;
};

export const sendVoiceApi = async (formData, token) => {
    const response = await axios.post(`${url}/voicemessage`, formData, getAuthHeaders(token));
    return response.data;
};

export const sendAttachmentApi = async (formData, token) => {
    const response = await axios.post(`${url}/fileattachment`, formData, getAuthHeaders(token));
    return response.data;
};
