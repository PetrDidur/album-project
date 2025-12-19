const express = require("express");
require("dotenv").config();
const serverConfig = require("./configs/serverConfig");
const cors = require('cors');
const apiRouter = require("./routes/api.route");
const authRouter = require("./routes/auth.router");

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));


serverConfig(app);


app.use("/api/auth", authRouter);
app.use("/api", apiRouter);

module.exports = app;