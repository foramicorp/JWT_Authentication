// IMPORTING REQUIREMENTS
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
require("dotenv").config();

// MIDDLEWARE FUNCTION TO CHECK FOR VALID JWT TOKEN
const isToken = (req, res, next) => {

    const token = req.cookies.accessToken;
    
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
    
    // CHECKING IF THE JWT IS VALID AND EXPIRED AND DECODING THE JWT 
    try {
        const decoded = jwt.verify(token  , process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) { 
        res.status(401).json({ message: "Invalid token" });
    }
};

// EXPORTING THE MIDDLEWARE FUNCTION
module.exports = isToken;
