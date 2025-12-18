
const jwtConfig = require("./jwtConfig");

const cookieConfig = {
  access: {
    maxAge: jwtConfig.access.expiresIn * 1000,
    httpOnly: true,
  },
  refresh: {
    maxAge: jwtConfig.refresh.expiresIn * 1000, 
    httpOnly: true,
  },
};

module.exports = cookieConfig;