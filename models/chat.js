const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
	{
		senderName: { type: String, required: true },
		sender: { type: String, required: true },
		content: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const ChatSchema = new mongoose.Schema(
	{
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		messages: [MessageSchema],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chat", ChatSchema);
