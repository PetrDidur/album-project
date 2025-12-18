const express = require("express");
require("dotenv").config();
const serverConfig = require("./configs/serverConfig");
const apiRouter = require("./routes/api.route");
// const ChatController = require("./controllers/chat.controller");

const app = express();

serverConfig(app);

app.use("/api", apiRouter);
// app.post("/aichat", ChatController.getChats);

