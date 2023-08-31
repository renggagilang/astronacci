var jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

module.exports = {
  createToken: (payload) => jwt.sign(payload, SECRET_KEY),
  decodeToken: (token) => jwt.verify(token, SECRET_KEY),
};
