import { useEffect, useState, useRef } from "react";
import Chat from "../components/Chat";
import Swal from "sweetalert2";
import { fetchUsers, sendMessageApi, fetchMessagesApi, sendVoiceApi, sendAttachmentApi,getFriendApi} from "../services/ChatService";
import { socket } from "../socket";

function ChatUser() {
    //   login user info
    const userString = localStorage.getItem("user");
    const userId = userString ? JSON.parse(userString).id : null;
    const userEmail = userString ? JSON.parse(userString).email : null;
    const token = localStorage.getItem("token");

    // component states

    const [user, setUser] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadMessages, setUnreadMessage] = useState({});
    const [connectedUser, setConnectedUser] = useState([]);
    const [isTyping, setIsTyping] = useState(null);
    const [sendMessage, setSendMessage] = useState({
        content: ""
    });
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [sending, setSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);
    const [callStatus, setCallStatus] = useState("idle");
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [activeCallPartnerId, setActiveCallPartner] = useState(null);
    const [isVideoCameraOff, setIsVideoCameraOff] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    // Refs
    const typingRef = useRef(null);
    const activeReceiverRef = useRef(null);

    const mediaRecorderRef = useRef(null);
    const audioChunkRef = useRef([]);
    const streamRef = useRef(null);
    const audioBlobRef = useRef(null);
    const sendingRef = useRef(false);
    const fileInputRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);






    // Fetch all user list
    // const fetchUser = async () => {
    //     try {
    //         const response = await fetchUsers();
    //         if (response && response.data) {
    //             const otherUser = response.data.filter(u => u._id !== userId);
    //             setUser(otherUser);
    //         } else {
    //             Swal.fire({
    //                 title: "Failed",
    //                 text: "Failed to fetch users"
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Failed to fetch users:", error);
    //     }
    // };
    const fetchUser =async()=>{
        try{
        if(!token) return;
        const response = await getFriendApi(token);
         if (response && response.friendships) {
                const friendList = response.friendships.map((f)=>{
                    return f.sender._id===userId ?f.receiver:f.sender;
                });
                setUser(friendList);
            } else {
                Swal.fire({
                    icon: "error",
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
            const response = await fetchMessagesApi(userId, selectedReceiverId, token);
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
            setConnectedUser(prev => prev.includes(newUserId) ? prev : [...prev, newUserId]);
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
        if (sendingRef.current)
            return;
        const sendToMessage = sendMessage.content.trim();
        if (!sendToMessage && !audioBlobRef.current && !selectedFile)
            return;

        if (audioBlobRef.current) {
            await handleSendVoice();
            return;
        }
        if (selectedFile) {
            await handleSendAttachment();
            return;
        }
        if (!userId) {
            console.log("User is not logged in");
            return;
        }
        sendingRef.current = true;
        setSending(true);

        setSendMessage({ content: "" });
        const tempId = `tempI-${Date.now()}`;
        const tempMessage = {
            _id: tempId,
            sender: userId,
            receiver: receiverId,
            message: sendToMessage,
            createdAt: new Date().toISOString(),
            isPending: true,
        };
        setMessages(prev => [...prev, tempMessage]);

        clearTimeout(typingRef.current);
        socket.emit("stopTyping", {
            sender: userId,
            receiver: receiverId
        });

        try {

            const messageData = {
                email: userEmail,
                // content: sendMessage.content,
                content: sendToMessage,
                receiver: receiverId
            };

            const response = await sendMessageApi(messageData);
            if (response && response.data) {
                // Emit socket event to receiver
                socket.emit('send-private-message', response.data);

                // Add to local message list
                // setMessages(prev => [...prev, response.data]);
                setMessages((prev) => prev.map((msg) => (msg._id === tempId ? response.data : msg))
                );

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
        } finally {
            sendingRef.current = false;
            setSending(false);

        }
    };
    //    start recording voice message 

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunkRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0)
                    audioChunkRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(
                    audioChunkRef.current,
                    { type: "audio/webm" }
                );
                audioBlobRef.current = audioBlob;
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);

                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);

        }
    };
    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handleSendVoice = async () => {
        if (sendingRef.current) return;
        if (!audioBlobRef.current || !receiverId || !userEmail) {
            return;
        }
        sendingRef.current = true;
        setSending(true);
        const formData = new FormData();
        formData.append(
            "voiceMessage",
            audioBlobRef.current,
            `voice-${Date.now()}.webm`
        );
        formData.append("sender", userEmail);
        formData.append("receiver", receiverId);

        try {
            const response = await sendVoiceApi(formData);
            if (response && response.data) {
                socket.emit('send-private-message', response.data);
                setMessages(prev => [...prev, response.data]);
                setAudioURL(null);
                audioBlobRef.current = null;
            }
        } catch (error) {

        }
        finally {
            // 4. Release lock and re-enable button when upload finishes
            sendingRef.current = false;
            setSending(false);
        }
    }
    // voice cancel
    const cancelVoice = () => {
        setAudioURL(null);
        audioBlobRef.current = null;
        setRecording(false);
    };

    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file)
            return
        console.log("selected file:", file);
        setSelectedFile(file);
    }
    const handleSendAttachment = async () => {
        if (sendingRef.current) return
        if (!selectedFile || !receiverId || !userEmail) { return }

        if (sending) return;
        sendingRef.current = true;
        setSending(true);
        try {

            const formData = new FormData();
            formData.append("receiver", receiverId);
            formData.append("sender", userEmail);
            formData.append("file", selectedFile);
            console.log("Sending attachment:", selectedFile);

            const response = await sendAttachmentApi(formData);
            if (response && response.data) {
                console.log("Attachment file", response.data);
                socket.emit("send-private-message", response.data);
                setMessages(prev => [...prev, response.data]);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setSending(false);
            sendingRef.current = false;
        }
    }
    const cancelAttachment = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ******voice call*****
    const handleStartCall = async () => {
        if (!userId || !receiverId) { return };
        console.log("starting call ....");
        setCallStatus("calling");
        setActiveCallPartner(receiverId);
        const peerConnection = createPeerConnection(receiverId);
        console.log("Peer connection:", peerConnection);
        const stream = await getLocalStream();
        if (!stream) {
            console.log("microphone stream not available");
        }

        addLocalTrack(peerConnection, stream);
        const offer = await createOffer(peerConnection);
        console.log("Offer Ready", offer);



        socket.emit("call-user", {
            callerId: userId,
            receiverId: receiverId,
            callType: "audio",
            offer: offer,
        });
        console.log("call user ", userId, receiverId);
    }

    useEffect(() => {
        const handleIncomingCall = (callData) => {
            setIncomingCall(callData);
            console.log("incoming call data", callData);
            console.log(setIncomingCall);
            setCallStatus("ringing");
        };

        socket.on("incoming-call", handleIncomingCall);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
        }
    }, []);

    const handleAcceptCall = async () => {
        if (!incomingCall) return;
        console.log("call accepted");
        setCallStatus("connected");
        setActiveCallPartner(incomingCall.callerId);

        const isVideo = incomingCall.callType === "video";
        if (isVideo) {
            setShowVideoCall(true);
            setIsVideoCameraOff(false);
        }

        const peerConnection = createPeerConnection(incomingCall.callerId);
        console.log("peer connection:", peerConnection);

        const stream = isVideo ?
            await getVideoStream()
            : await getLocalStream();

        if (!stream) return;
        if (isVideo && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        console.log("stream created", stream);
        await addLocalTrack(peerConnection, stream);
        console.log(" addlocaltrack");
        await peerConnection.setRemoteDescription(incomingCall.offer);
        console.log("Remote offer set");
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log("Answer created:", answer);
        socket.emit("accept-call", {
            callerId: incomingCall.callerId,
            receiverId: userId,
            answer: answer
        });
      setIncomingCall(null);
    };

    const handleRejectCall = () => {
        console.log("rejected");
        if (!incomingCall) {
            return;
        }

        socket.emit("reject-call", {
            callerId: incomingCall.callerId,
            receiverId: userId,
        });
        setIncomingCall(null);
        setCallStatus("idle");
    };

    useEffect(() => {
        const handleCallRejected = () => {
            console.log("call rejected ");
            setCallStatus("idle");
            setShowVideoCall(false);
            setLocalStream(null);
            setRemoteStream(null);
            Swal.fire({
                icon: "error",
                title: "Call Declined",
                text: "User declined your call",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };

        socket.on("call-rejected", handleCallRejected);

        return () => {
            socket.off("call-rejected", handleCallRejected);
        };
    }, []);

    useEffect(() => {
        const handleCallAccepted = async (data) => {
            console.log("call accepted");
            const peerConnection = peerConnectionRef.current;
            if (!peerConnection) {
                console.log("peer connection not");
                return;
            }
            await peerConnection.setRemoteDescription(data.answer);
            setCallStatus("connected");
            console.log("Remote answer set");
        };
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("call-accepted", handleCallAccepted);
        };
    }, []);

    //create peer connection 
    const createPeerConnection = (otherUserId) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        });
        peerConnectionRef.current = peerConnection;
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    // receiverId:receiverId,
                    receiverId: otherUserId,
                    candidate: event.candidate
                });
                console.log('ice candidate generated', event.candidate);
            }
        };
        peerConnection.ontrack = (event) => {
            console.log("remote track received:", event.streams[0]);
            remoteStreamRef.current = event.streams[0];
            setRemoteStream(event.streams[0]);

            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        console.log("peer connected created");
        return peerConnection;
    };
    // get microphone
    const getLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            localStreamRef.current = stream;
            setLocalStream(stream);

            console.log("microphone Access granted");
            return stream;
        } catch (error) {
            console.error("microphone access failed:", error);
            return null;
        }
    };
    // add the audio track
    const addLocalTrack = (peerConnection, stream) => {
        console.log(stream);
        console.log(stream instanceof MediaStream);
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });
        console.log("local audio track added");
    }
    // create offer
    const createOffer = async (peerConnection) => {
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log("offer Created:", offer);
            return offer;
        } catch (error) {
            console.error("failed to create offer:", error);
        }

    }
    useEffect(() => {
        const handleIceCandidate = async (data) => {
            console.log("ice candidate receive");
            const peerConnection = peerConnectionRef.current;
            if (!peerConnection) {
                console.log("Peer connection not found");
                return;
            }
            await peerConnection.addIceCandidate(data.candidate);
            console.log("ice candidate added");
        };
        socket.on("ice-candidate", handleIceCandidate);
        return () => {
            socket.off("ice-candidate", handleIceCandidate);
        };
    }, []);
    //end call logic
    const handleEndCall = () => {
        console.log("Ending Call");
        setCallStatus("idle");
        setIsMuted(false);
        setCallDuration(0);
        setIsVideoCameraOff(false);
        setShowVideoCall(false);
        setLocalStream(null);
        setRemoteStream(null);
        //web RTC close
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        //stop microphone
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            localStreamRef.current = null;
        }
        //stop remote audio
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
        remoteStreamRef.current = null;
        const targetId = activeCallPartnerId || receiverId;
        //notify other user
        if (targetId) {
            socket.emit("call-end", {
                callerId: userId,
                receiverId: targetId
            });
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }


        console.log("call ended");
        setActiveCallPartner(null);
    };

    useEffect(() => {
        const handleCallEnded = () => {
            console.log("call ended by other user");
            setIsMuted(false);
            setCallStatus("idle");
            setCallDuration(0);
            setActiveCallPartner(null);
            setIsVideoCameraOff(false);
            setShowVideoCall(false);
            setLocalStream(null);
            setRemoteStream(null);
            Swal.fire({
                icon: "info",
                title: "Call Ended",
                text: "The other user ended the call",
                timer: 2500,
                showConfirmButton: false,
                toast: true,
                position: "top-end"
            });
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
                localStreamRef.current = null;
                remoteStreamRef.current = null;
            }
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = null;
            }
        };
        socket.on("call-ended", handleCallEnded);
        return () => {
            socket.off("call-ended", handleCallEnded);
        };
    }, []);

    const toggleMuted = () => {
        const stream = localStreamRef.current;
        if (!stream) {
            console.log("local stream not found");
            return;
        }
        const audioTrack = stream.getAudioTracks()[0];
        if (!audioTrack) {
            console.log("Audio track not found");
            return;
        }
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log(audioTrack.enabled ? "microphone unmuted" : "microphone muted");
    };

    useEffect(() => {
        let timer;
        if (callStatus === "connected") {
            timer = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        };
    }, [callStatus]);

    // format the second
    const formatCallDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    };

    const toggleCamera = async () => {
        let stream = localStreamRef.current;
        if (!stream) {
            stream = await getVideoStream();
            if (!stream) return;
            setShowVideoCall(true);
            setIsVideoCameraOff(false);
            return;
        }

        let videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) {
            // Audio-only call upgrading to video
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const newVideoTrack = videoStream.getVideoTracks()[0];
                if (newVideoTrack) {
                    stream.addTrack(newVideoTrack);
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.addTrack(newVideoTrack, stream);
                    }
                    videoTrack = newVideoTrack;
                    setLocalStream(new MediaStream(stream.getTracks()));
                    setShowVideoCall(true);
                    setIsVideoCameraOff(false);
                    return;
                }
            } catch (err) {
                console.error("Camera access failed:", err);
                Swal.fire({
                    icon: "error",
                    title: "Camera Access Denied",
                    text: "Could not access your camera.",
                });
                return;
            }
        }

        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            const isOff = !videoTrack.enabled;
            setIsVideoCameraOff(isOff);
            if (!isOff) {
                setShowVideoCall(true);
            }
            console.log(videoTrack.enabled ? "Camera on" : "Camera off");
        }
    };

    // for video call
    const getVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            localStreamRef.current = stream;
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            console.log("Camera and microphone access granted");
            return stream;
        }
        catch (error) {
            console.error("Camera/microphone access failed:", error);

            Swal.fire({
                icon: "error",
                title: "Camera Access Denied",
                text: "Please allow camera and microphone permission",
            });
            return null;
        }
    };

    const handleStartVideoCall = async () => {
        if (!userId || !receiverId)
            return;
        console.log("starting video call ...");

        setCallStatus("calling");
        setActiveCallPartner(receiverId);
        setIsVideoCameraOff(false);
        setShowVideoCall(true);
        const peerConnection = createPeerConnection(receiverId);
        const stream = await getVideoStream();
        if (!stream) {
            setCallStatus("idle");
            setShowVideoCall(false);
            return;
        }
        addLocalTrack(peerConnection, stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        const offer = await createOffer(peerConnection);
        console.log("Video offer ready:", offer);
        socket.emit("call-user", {
            callerId: userId,
            receiverId: receiverId,
            callType: "video",
            offer: offer,
        });
    };





    const activeCallPartner = user.find(u => u._id === activeCallPartnerId) || user.find(u => u._id === receiverId);

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
            unreadMessages={unreadMessages}
            recording={recording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            audioURL={audioURL}
            cancelVoice={cancelVoice}
            sending={sending}
            handleAttachmentClick={handleAttachmentClick}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            handleSendAttachment={handleSendAttachment}
            cancelAttachment={cancelAttachment}
            setSelectedFile={setSelectedFile}
            handleStartCall={handleStartCall}
            handleAcceptCall={handleAcceptCall}
            handleRejectCall={handleRejectCall}
            incomingCall={incomingCall}
            remoteAudioRef={remoteAudioRef}
            handleEndCall={handleEndCall}
            callStatus={callStatus}
            isMuted={isMuted}
            toggleMuted={toggleMuted}
            callDuration={callDuration}
            formatCallDuration={formatCallDuration}
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            toggleCamera={toggleCamera}
            isVideoCameraOff={isVideoCameraOff}
            handleStartVideoCall={handleStartVideoCall}
            activeCallPartner={activeCallPartner}
            showVideoCall={showVideoCall}
            setShowVideoCall={setShowVideoCall}
            localStream={localStream}
            remoteStream={remoteStream}
        />
    );
}

export default ChatUser;
