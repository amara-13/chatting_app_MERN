const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { fetchUsers, saveMessage, getMessages,sendFriendRequest,
    rejectFriendRequest,getPendingRequests,acceptFriendRequest,
    getFriend,unFriend,cancelRequest,voiceMessage,fileAttachment} = require("../controllers/chatController");


const { protect } = require("../middleware/authMiddleware");
router.get("/users", fetchUsers);
router.post("/message", saveMessage);
router.post("/message", saveMessage);
router.post("/friendrequest/send",protect,sendFriendRequest);
router.get("/friendrequest/get",  protect,getPendingRequests);
router.patch("/friendrequest/accept",protect,acceptFriendRequest);
router.patch("/friendrequest/reject",protect,rejectFriendRequest);
router.patch("/friendrequest/unfriend",protect,unFriend);
router.patch("/friendrequest/cancel",protect,cancelRequest);

router.get("/friends",protect,getFriend);
router.post("/message",protect, saveMessage);
router.get("/messages/:senderId/:receiverId",protect,getMessages);
router.post("/voicemessage",upload.single("voiceMessage"),protect,voiceMessage);
router.post("/fileattachment",upload.single("file"),protect,fileAttachment)
module.exports = router;
