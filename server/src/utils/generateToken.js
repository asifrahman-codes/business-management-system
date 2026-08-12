const jwt = require("jsonwebtoken");
const env = require("../config/env.config");

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    env.jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;