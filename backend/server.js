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
        socket.emit("get-online-users",Object.keys(onlineUser));
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
socket.on('typing',(data)=>{
    const {sender,receiver} = data;
    const receiverSocket = onlineUser[receiver];
    if(receiverSocket){
    io.to(receiverSocket).emit("typingIndicator",sender);
    }}
);
socket.on("stopTyping",(data)=>{
    const {sender,receiver} = data;
    const receiverSocket = onlineUser[receiver];
    console.log("receiver typer",receiverSocket);
    if(receiverSocket){
    io.to(receiverSocket).emit("stopTypingIndicator",sender);
    }
})


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

