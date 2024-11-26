const socket = io();

socket.emit("joinRoom", { userId, room: chatId });
const chatBox = document.getElementById("chatBox");

socket.on("message", ({ username, message, createdAt }) => {
	console.log(`${username}: ${message}`);

	const div = document.createElement("div");
	div.textContent = `[${new Date(
		createdAt
	).toLocaleTimeString()}] ${username}: ${message}`;
	chatBox.appendChild(div);

	chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById("messageForm").addEventListener("submit", (e) => {
	e.preventDefault();
	const message = document.getElementById("message").value;
	if (message.trim()) {
		socket.emit("chatMessage", { chatId, userId, message, senderName });

		const chatBox = document.getElementById("chatBox");
		chatBox.scrollTop = chatBox.scrollHeight;
		document.getElementById("message").value = "";
	}
});
