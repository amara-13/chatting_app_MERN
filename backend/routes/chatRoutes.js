const express = require("express");
const router = express.Router();
const { fetchUsers, saveMessage, getMessages } = require("../controllers/chatController");

router.get("/users", fetchUsers);
router.post("/message", saveMessage);
router.get("/messages/:senderId/:receiverId", getMessages);
module.exports = router;