const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
};

module.exports = generateToken;