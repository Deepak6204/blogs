const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const { getMessages } = require("../controllers/chatController");

router.post("/initiate", async (req, res) => {
	console.log(req);
	const { profileId, currentUserId } = req.body;
	console.log(profileId, currentUserId);

	if (!profileId || !currentUserId) {
		return res.status(400).json({ success: false, message: "Invalid data" });
	}

	try {
		let chat = await Chat.findOne({
			participants: { $all: [profileId, currentUserId] },
		});

		if (!chat) {
			chat = new Chat({
				participants: [profileId, currentUserId],
				createdAt: new Date(),
			});
			await chat.save();
		}

		res.json({ success: true, chatId: chat._id });
	} catch (error) {
		console.error("Error initiating chat:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

router.get("/:id", getMessages);

module.exports = router;
