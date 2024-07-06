const { genSalt, hash, compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");

const hashPassword = async (password) => {
     const salt = await genSalt(10);
     const hashpwd = await hash(password, salt);
     return hashpwd;
};
const comparePassword = async (password, hash) => {
     const bool = await compare(password, hash);
     return bool;
};

const generateAccessToken = (payload) => {
     const token = sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN ?? "1hr",
     });
     return token;
};

const verifyAccessToken = (token) => {
     const decodedToken = verify(token, process.env.JWT_SECRET);
     return decodedToken;
};

module.exports = {
     hashPassword,
     comparePassword,
     generateAccessToken,
     verifyAccessToken,
};
