const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { fetchUsers, saveMessage, getMessages,
    // sendFriendRequest
voiceMessage} = require("../controllers/chatController");

router.get("/users", fetchUsers);
router.post("/message", saveMessage);
router.post("/message", saveMessage);
// router.post("/friendrequest/:receiverId");
router.get("/messages/:senderId/:receiverId", getMessages);
router.post("/voicemessage",upload.single("voiceMessage"),voiceMessage);
module.exports = router;