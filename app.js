require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const chatRoute = require("./routes/chat");

const {
	checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const socketController = require("./controllers/chatController");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8000;

mongoose
	.connect(process.env.MONGO_URL)
	.then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
	console.log(`new user connected: ${socket.id}`);
	socketController.socketHandler(io, socket);
	socket.on("disconnect", () => {
		console.log(`Client Disconnected:${socket.id}`);
	});
});

app.get("/", async (req, res) => {
	const allBlogs = await Blog.find({});
	res.render("home", {
		user: req.user,
		blogs: allBlogs,
	});
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/chat", chatRoute);

server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
