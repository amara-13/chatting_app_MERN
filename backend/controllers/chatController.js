const Users = require("../models/User");
const Messages = require("../models/Messages");
const Cloudinary = require("../config/cloudinary");



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



// send Friend request
// const sendFriendRequest  = async(req,res)=>{
//     try{
//         const{receiver,sender} = req.body;
//         if(!receiver && !sender){
//             return res.status(400).json({
//                 status:false,
//                 message:"receiver  and id required"
//             });
            
//         }
//         if(sender===sender){
//           return res.status(400).json({
//                 status:false,
//                 message:"don't send friend request to yourself"
//             });  
//         }
//         if()
//     }catch(error){

//     }
// }
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"upload/voice");
//     },
//     filename:(req,file,cb)=>{
//         cb(null,`${Date.now()-${file.originalname}`);
//     }
// });
// const upload = multer({storage})
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
            return response.status(422).json({
                status:false,
                success:"receiver required"
            });
        } 
        if(!file){
            return response.status(422).json({
                status:false,
                success:"voice message is  required"
            });
        }
        const user = await Users.findOne({email:sender.toLowerCase().trim()});
        if(!user){
            return response.status(401).json({
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
module.exports = {
    fetchUsers,
    saveMessage,
    getMessages,
    // sendFriendRequest,
    voiceMessage
};

