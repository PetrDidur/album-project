const express = require("express");
const morgan = require("morgan");
const authRouter = require("./routes/auth.router");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter); 

module.exports = app;