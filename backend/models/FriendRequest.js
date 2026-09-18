const mongoose = require("mongoose");
const friendRequestSchema = mongoose.Schema(
    {
   
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
         receiver:{
           type:mongoose.Schema.Types.ObjectId,
            required:true,
        },
        status:{
            type:String,
            enum:["pending","accept","reject"],
            default:"pending",
        },
    },
    {
        timestamps:true,
    }
)
const friendRequest = mongoose.model("FriendRequest",friendRequestSchema);
module.exports=friendRequest;