const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

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
  app.use("/public", express.static(path.join(__dirname, "../public")));
  app.use("/photos", express.static(path.join(__dirname, "../public/photos")));
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  });
}

module.exports = serverConfig;
