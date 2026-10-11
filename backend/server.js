const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/routes");
const chatRoutes = require("./routes/chatRoutes");
// socket.io
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { connected } = require("node:process");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api", chatRoutes);

// Health check route
// app.get("/", (req, res) => {
//     res.json({
//         message: "MERN backend is working!"
//     });
// });

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
app.use(express.static("public"));
const onlineUser = {};


io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // **Receive the logged-in user's ID

    socket.on('user-connected', (userId) => {
        onlineUser[userId] = socket.id;
        console.log('User connected:', onlineUser);

        // Tell all connected clients that this user is online
        socket.broadcast.emit("user-online", userId);
        socket.emit("get-online-users", Object.keys(onlineUser));
    });

    socket.on('send-private-message', (messageData) => {
        const { sender, receiver, message } = messageData;
        const receiverId = onlineUser[receiver];
        console.log("this is receiver id", receiverId);
        if (receiverId) {
            io.to(receiverId).emit('receive-private-message', messageData);
        }
    });
    // typing indicator
    socket.on('typing', (data) => {
        const { sender, receiver } = data;
        const receiverSocket = onlineUser[receiver];
        if (receiverSocket) {
            io.to(receiverSocket).emit("typingIndicator", sender);
        }
    }
    );
    socket.on("stopTyping", (data) => {
        const { sender, receiver } = data;
        const receiverSocket = onlineUser[receiver];
        console.log("receiver typer", receiverSocket);
        if (receiverSocket) {
            io.to(receiverSocket).emit("stopTypingIndicator", sender);
        }
    })

    // voice call
    socket.on('call-user', (data) => {
        const { callerId, receiverId, callType, offer } = data;
        const receiverSocketId = onlineUser[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming-call", {
                callerId,
                receiverId,
                callType,
                offer
            });
        } else {
            console.log("Receiver is offline")
        }
    });
    // reject the call[]
    socket.on("reject-call", (data) => {
        const { callerId, receiverId } = data;
        const callerSocketId = onlineUser[callerId];
        if (callerSocketId) {
            io.to(callerSocketId).emit("call-rejected");
        }
    });
    //accept callll
    socket.on("accept-call", (data) => {
        const { callerId, receiverId, answer } = data;
        const callerSocketId = onlineUser[callerId];
        if (callerSocketId) {
            io.to(callerSocketId).emit("call-accepted", {
                receiverId, answer
            }
            );
        }
        console.log("call receive", data);
    });

    // create ice-candidate
    socket.on("ice-candidate", (data) => {
        const { receiverId, candidate } = data;
        const receiverSocketId = onlineUser[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("ice-candidate", {
                candidate
            });
        }
    });
    // call end
    socket.on("call-end", (data) => {
        const { callerId, receiverId } = data;
        const receiversocketId = onlineUser[receiverId];
        if (receiversocketId) {
            io.to(receiversocketId).emit("call-ended");
        }
    });

    // Real-time friend request events
    socket.on("friend-request-sent", (data) => {
        console.log("friend-request-sent event:", data);
        const { receiverId } = data;
        const receiverSocketId = onlineUser[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friend-request-received", data);
        } else {
            socket.broadcast.emit("friend-request-received", data);
        }
    });

    socket.on("friend-request-action", (data) => {
        console.log("friend-request-action event:", data);
        const { targetUserId } = data;
        const targetSocketId = onlineUser[targetUserId];
        if (targetSocketId) {
            io.to(targetSocketId).emit("friend-request-updated", data);
        } else {
            socket.broadcast.emit("friend-request-updated", data);
        }
    });










    // socket.on("ice-candidate",(data)=>{
    //     const{receiverId,candidate} = data;
    //     const receiverSocketId = onlineUser[receiverId];
    //     if(receiverSocketId){
    //         io.to(receiverSocketId).emit("ice-candidate",{
    //         candidate
    //         });
    //     }
    // });

    // disconnect
    socket.on('disconnect', (reason) => {
        const userId = Object.keys(onlineUser).find(id => onlineUser[id] === socket.id);
        if (userId) {
            delete onlineUser[userId];
        }
        console.log('a user disconnected ', socket.id, '|Reason: ', reason);

        io.emit("user-offline", userId);
        console.log("this is the list of online user ", onlineUser);

    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

