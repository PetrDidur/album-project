const express = require("express");
require("dotenv").config();
const serverConfig = require("./configs/serverConfig");
const apiRouter = require("./routes/api.route");
const authRouter = require("./routes/auth.router");
// const ChatController = require("./controllers/chat.controller");

const app = express();

serverConfig(app);

app.use("/auth", authRouter); 
app.use("/api", apiRouter);
// app.post("/aichat", ChatController.getChats);

