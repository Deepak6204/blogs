const Chat = require("../models/chat");

exports.socketHandler = (io, socket) => {
	socket.on("joinRoom", async ({ username, room }) => {
		socket.join(room);
		console.log(`${username} joined room: ${room}`);
	});

	socket.on("chatMessage", async ({ chatId, userId, message, senderName }) => {
		try {
			const chat = await Chat.findById(chatId);
			if (!chat) {
				console.error(`Chat with ID ${chatId} not found`);
				return;
			}
			const newMessage = {
				senderName: senderName,
				sender: userId,
				content: message,
			};
			chat.messages.push(newMessage);
			await chat.save();
			const createdAt = new Date();
			io.to(chatId).emit("message", {
				username: senderName,
				message: message,
				createdAt: createdAt,
			});
		} catch (err) {
			console.error("Error saving chat message:", err);
		}
	});
};

exports.getMessages = async (req, res) => {
	const { id } = req.params;
	console.log(id);

	try {
		const chat = await Chat.findById(id);

		if (!chat) {
			return res.status(404).json({ error: "Chat room not found" });
		}

		res.render("chat", {
			messages: chat.messages,
			chatId: id,
			userId: req.user._id,
			senderName: req.user.name,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
