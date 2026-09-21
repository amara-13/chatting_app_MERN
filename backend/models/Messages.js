const mongoose = require("mongoose");
const User = require("../models/User");
const  messageSchema = new mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,

        },
        receiver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,

        },
        message:{
            type:String,
            required:false,
        },
        isRead:{
            type:Boolean,
            default:false
        },
        messageType:{
            type:String,
            enum:["text","voice","file"],
            default:"text",
        },
        audioUrl:{
            type:String,
            default:null,
        },
        fileUrl:{
            type:String,
            default:null,
        },
        fileName:{
            type:String,
            default:null,
        },
        fileType:{
            type:String,
            default:null
        },

    },
    {
        timestamps:true,
    }
);
const Messages = mongoose.model('Messages',messageSchema);
module.exports = Messages;