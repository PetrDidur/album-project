require("dotenv").config(); // потому что там сохранены строки - секретики
const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/jwtConfig");

// payload - user
const generateTokens = (payload) => ({
    // токен доступа
  accessToken: jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    jwtConfig.access
  ),
  // токен обновления
  refreshToken: jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    jwtConfig.refresh
  ),
});

module.exports = generateTokens;