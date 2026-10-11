const Users = require("../models/User");
const Messages = require("../models/Messages");
const Cloudinary = require("../config/cloudinary");
const FriendRequest = require("../models/FriendRequest");



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
        await Messages.updateMany(
            {
                sender: receiverId, receiver: senderId, isRead: false
            },
            { $set: { isRead: true } }
        );
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
// send Friend request
const sendFriendRequest = async (req, res) => {
    try {
        const {receiver} = req.body;
        const sender = req.user.id;
        if (!receiver || !sender) {
            return res.status(400).json({
                status: false,
                message: "receiver  and id required"
            });

        }
        if (sender === receiver) {
            return res.status(400).json({
                status: false,
                message: "don't send friend request to yourself"
            });
        }
        const existing = await FriendRequest.findOne({
            $or: [
                {
                    sender: sender,
                    receiver: receiver,
                },
                {
                    sender: receiver,
                    receiver: sender,

                }
            ],
            status: {
                $in: ["pending", "accepted"],
            },
        }
        );
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Friend request already pending",
            });
        }

        const friendRequest = await FriendRequest.create({
            sender: sender,
            receiver: receiver,
            status: "pending",
        });

        return res.status(201).json({
            status: true,
            message: "Friend request sent successfully",
            friendRequest,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}
const getPendingRequests = async(req,res)=>{
try{
    // const{receiver,userId} = req.body;
    const userId = req.user._id;
    if (!userId) {
            return res.status(400).json({
                status: false,
                message: "user id required"
            });
        }
    const requests = await FriendRequest.find({
       $or:[
         {receiver:userId},
         {sender:userId},
       ],
       

        status:"pending"})
        .populate("sender","name email")
        .populate("receiver","name email");
        
        return res.status(200).json({
            status: true,
            message: "Pending friend requests fetched successfully",
            requests,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const{requestId,} = req.body;
        const userId = req.user._id;
         console.log("Request ID:", requestId);
        console.log("Logged-in user:", userId);
        if(!requestId || !userId){
            return res.status(400).json({
                success:false,
                message:"requestId and receiverId are need to required"
            });
        }
        const request = await FriendRequest.findOne({
            _id:requestId,
           receiver:userId,            
           status:"pending"
              
           });

       if (!request) {
    return res.status(400).json({
        success: false,
        message: "There is no pending request available"
    });
}
request.status="accepted";
await request.save();
 return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: "requestId is required"
            });
        }

        const request = await FriendRequest.findOne({
            _id: requestId,
            receiver: userId,
            status: "pending"
        });

        if (!request) {
            return res.status(400).json({
                success: false,
                message: "There is no pending request available"
            });
        }

        request.status = "rejected";

        await request.save();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected successfully",
            request
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
const getFriend = async(req,res)=>{
    
        try{
            const userId = req.user._id;
            const friendships = await FriendRequest.find({
                $or:[
                    {sender:userId},
                    {receiver:userId},                  
                ],
                status:"accepted"
            }).populate("sender","name email").populate("receiver","name email");
            return res.status(200).json({
                success:true,
                message:"Friend fetch successfully",
                friendships
            });

        }catch(error){
            return res.status(500).json({
                success:false,
                message:"something went wrong",
                error:error.message
            });

        }
    };
const cancelRequest = async(req,res)=>{
    try{
        const{requestId}= req.body;
        const userId= req.user._id;
        if(!requestId || !userId){
            return res.status(400).json({
                success:false,
                message:"request id and sender are required"
            });
        }
            const request = await FriendRequest.findOne({
                _id:requestId,
                sender:userId,
                status:"pending"
            });
            if(!request){
                return  res.status(400).json({
                    success:false,
                    message:"no request found"
                });          
        }
        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({
            success:true,
            message:"request cancel successfully"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }

}
const unFriend = async (req,res)=>{
    try{
        const{requestId} = req.body;
        const userId = req.user._id;
        if(!requestId || !userId){
            return res.status(400).json({
                success:false,
                message:"request id and sender are required"
            });
        }

            const request = await FriendRequest.findOne({
                _id:requestId,
                $or:[
                    {sender:userId},
                    {receiver:userId},
                ],               
                status:"accepted"
            });
            if(!request){
                return  res.status(400).json({
                    success:false,
                    message:"no friendship found"
                });          
        }
        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({
            success:true,
            message: "Friend removed successfully" 
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

const voiceMessage = async(req,res)=>{
    try{
        console.log("File",req.file);
        console.log("Receiver",req.body.receiver);

        const{sender,receiver} = req.body;
        const file = req.file;
        if(!sender){
            return res.status(422).json({
                status:false,
                success:"sender required"
            });
        }
        if(!receiver){
            return res.status(422).json({
                status:false,
                success:"receiver required"
            });
        }
        if(!file){
            return res.status(422).json({
                status:false,
                success:"voice message is  required"
            });
        }
        const user = await Users.findOne({email:sender.toLowerCase().trim()});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"sender is not authenticated"
            });
        }

        const result = await  Cloudinary.uploader.upload(req.file.path,{
            resource_type: "video"
        });
       console.log("cloudinary url",result.secure_url);

       const newMessage = await  Messages.create({
        sender:user._id,
        receiver:req.body.receiver,
        messageType:"voice",
        audioUrl:result.secure_url,
            message: "Voice message"
        });

        return res.status(200).json({
         success:true,
         message:"voice message received",
            //  file:req.file
        data:newMessage,
        });

    }

     catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"voice message upload failed"
        });
    }
}

//send file Attachment
const fileAttachment = async(req,res)=>{
    try{
    const{sender,receiver} = req.body;
        const file = req.file;
        if(!sender){
            return res.status(422).json({
                status:false,
                success:"sender required"
            });
        }
        if(!receiver){
            return res.status(422).json({
                status:false,
                success:"receiver required"
            });
        }
        if(!file){
            return res.status(422).json({
                status:false,
                success:"voice message is  required"
            });
        }
         const user = await Users.findOne({email:sender.toLowerCase().trim()});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"sender is not authenticated"
            });
        }

        const result = await Cloudinary.uploader.upload(req.file.path,{
            resource_type:"auto"
        });

        newFile = await  Messages.create({
            sender:user._id,
            receiver:receiver,
            message:req.file.originalname,
            messageType:"file",
            fileUrl:result.secure_url,
            fileName:req.file.originalname,
            fileType:req.file.mimetype,
        });
        return res.status(200).json({
         success:true,
         message:"voice message received",
        data:newFile,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Attachment upload failed"
        });
    }

}
module.exports = {
    fetchUsers,
    saveMessage,
    getMessages,
    sendFriendRequest,
    getPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelRequest,
    getFriend,
    unFriend,
    voiceMessage,
    fileAttachment
};

