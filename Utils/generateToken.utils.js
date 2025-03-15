// IMPORTING REQUIREMENTS
const jwt = require("jsonwebtoken");
require("dotenv").config();

// GENERATE ACCESS TOKEN 
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

// GENERATE REFRESH TOKEN
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
    return refreshToken;
}

// EXPORTING TOKENS 
module.exports = {
    generateAccessToken,
    generateRefreshToken
}