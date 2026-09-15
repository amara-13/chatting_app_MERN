import { useEffect, useState, useRef } from "react";
import Chat from "../components/Chat";
import Swal from "sweetalert2";
import { fetchUsers, sendMessageApi, fetchMessagesApi } from "../services/ChatService";
import { socket } from "../socket";

function ChatUser() {
    //   login user info
     const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;
    const userEmail = userString ? JSON.parse(userString).email : null;
  
    // component states

    const [user, setUser] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadMessages,setUnreadMessage] = useState({});
    const [connectedUser, setConnectedUser] = useState([]);
    const [isTyping, setIsTyping] = useState(null);
    const [sendMessage, setSendMessage] = useState({
        content: ""
    });

    // Refs
     const typingRef = useRef(null);
    const activeReceiverRef = useRef(null);


    // Fetch all user list
    const fetchUser = async () => {
        try {
            const response = await fetchUsers();
            if (response && response.data) {
                const otherUser = response.data.filter(u => u._id !== userId);
                setUser(otherUser);
            } else {
                Swal.fire({
                    title: "Failed",
                    text: "Failed to fetch users"
                });
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    //Fetch message history for selected chat
    const loadMessages = async (selectedReceiverId) => {
        if (!userId || !selectedReceiverId) return;
        try {
            const response = await fetchMessagesApi(userId, selectedReceiverId);
            if (response && response.data) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

     // Keep activeReceiverRef in sync with receiverId
    useEffect(() => {
        activeReceiverRef.current = receiverId;
    }, [receiverId]);

    // Socket Connection & Presence Lifecycle
    useEffect(() => {
        fetchUser();

        const registerUser = () => {
            if (userId) {
                socket.emit('user-connected', userId);
            }
        };

        if (socket.connected) {
            registerUser();
        }
        socket.on('connect', registerUser);

        socket.on("user-online", (newUserId) => {
            setConnectedUser(prev => [...prev, newUserId]);
        });

        socket.on("get-online-users", (userIds) => {
            setConnectedUser(userIds);
        });

        socket.on("user-offline", (offlineUserId) => {
            setConnectedUser(prev => prev.filter(id => id !== offlineUserId));
        });

        socket.on("typingIndicator", (sender) => {
            setIsTyping(sender);
        });

        socket.on("stopTypingIndicator", (sender) => {
            setIsTyping(prev => (prev === sender ? null : prev));
        });

        return () => {
            socket.off('connect', registerUser);
            socket.off("user-online");
            socket.off('user-offline');
            socket.off('get-online-users');
            socket.off('typingIndicator');
            socket.off('stopTypingIndicator');
        };
    }, [userId]);

    // Global Socket Listener for incoming private messages
    useEffect(() => {
        const handleReceiverMessage = (messageData) => {
            const currentActiveId = activeReceiverRef.current;
            const senderId = messageData.sender;

            // If this message belongs to the currently open chat, append to messages
            if (currentActiveId && (senderId === currentActiveId || messageData.receiver === currentActiveId)) {
                setMessages((prev) => [...prev, messageData]);
            } else {
                // Otherwise, increment unread count for this sender
                setUnreadMessage((prev) => ({
                    ...prev,
                    [senderId]: (prev[senderId] || 0) + 1,
                }));
            }
        };

        socket.on('receive-private-message', handleReceiverMessage);

        return () => {
            socket.off('receive-private-message', handleReceiverMessage);
        };
    }, []);

    // Active Chat Selection (Load messages & clear unread badge)
    useEffect(() => {
        if (!receiverId) {
            setMessages([]);
            return;
        }

        // Fetch messages from database for selected user
        loadMessages(receiverId);

        // Clear unread badge for the clicked user
        setUnreadMessage((prev) => {
            const updated = { ...prev };
            delete updated[receiverId];
            return updated;
        });
    }, [receiverId, userId]);
   
    // Typing handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        setSendMessage(prev => ({
            ...prev,
            [name]: value,
        }));

        if (!userId || !receiverId) return;

        if (value.trim() === "") {
            clearTimeout(typingRef.current);
            socket.emit("stopTyping", {
                sender: userId,
                receiver: receiverId,
            });
            return;
        }

        socket.emit("typing", {
            sender: userId,
            receiver: receiverId,
        });

        clearTimeout(typingRef.current);
        typingRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                sender: userId,
                receiver: receiverId
            });
        }, 3000);
    };

    
    // Send message submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sendMessage.content.trim()) return;

        clearTimeout(typingRef.current);
        socket.emit("stopTyping", {
            sender: userId,
            receiver: receiverId
        });

        if (!userId) {
            console.log("User is not logged in");
            return;
        }

        try {
            const messageData = {
                email: userEmail,
                content: sendMessage.content,
                receiver: receiverId
            };

            const response = await sendMessageApi(messageData);
            if (response && response.data) {
                // Emit socket event to receiver
                socket.emit('send-private-message', response.data);

                // Add to local message list
                setMessages(prev => [...prev, response.data]);
                setSendMessage({ content: "" });
            } else {
                Swal.fire({
                    title: "Failed",
                    text: "Failed to send message"
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to send message";
            Swal.fire({
                title: "Failed",
                text: errorMsg,
            });
        }
    };
   

    
    return (
        <Chat
            users={user}
            connectedUser={connectedUser}
            handleChange={handleChange}
            sendMessage={sendMessage}
            handleSubmit={handleSubmit}
            setReceiverId={setReceiverId}
            messages={messages}
            currentUser={userId}
            isTyping={isTyping}
            unreadMessages = {unreadMessages}
        />
    );
}

export default ChatUser;
