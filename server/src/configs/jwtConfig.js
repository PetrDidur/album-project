const jwtConfig = {
  access: {
    expiresIn: 60,
  },
  refresh: {
    expiresIn: 60 * 60 * 24, 
  },
};

module.exports = jwtConfig;