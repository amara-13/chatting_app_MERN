const Users = require("../models/User");
const Messages = require("../models/Messages");

//fetch all users
const fetchUsers = async (req, res) => {
    try {
        const allUsers = await Users.find().select("-password -otp -otpExpiresAt -resetOtp -resetOtpExpiresAt");
        res.status(200).json({
            success: true,
            message: "fetch all users successfully",
            data: allUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// save message
const saveMessage = async (req, res) => {
    try {
        const { email, content, receiver } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!content) {
            return res.status(400).json({ message: "message content is required" });
        }
        if (!receiver) {
            return res.status(400).json({ message: "Receiver is required" });
        }
        const user = await Users.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });

        }
        const newMessage = await Messages.create({
            sender: user._id,
            receiver: receiver,
            message: content

        });
        res.status(200).json({
            success: true,
            message: "message save successfully",
            data: newMessage,
        });


    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
// get messages between specific sender and receiver
const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Messages.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    fetchUsers,
    saveMessage,
    getMessages
};

