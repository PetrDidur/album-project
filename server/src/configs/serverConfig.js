const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsConfig = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
  credentials: true,
};
function serverConfig(app) {
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cors(corsConfig));
  app.use(cookieParser());
}

module.exports = serverConfig;
