// MIDDLEWARE FUNCTION TO EXTRACT USERID 
const extractUserId = (req, res, next) => {
    const userId = req.cookies.userId; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found in cookies" });
    }

    req.userId = userId; 
    next();
};

// EXPORTING THE MIDDLEWARE FUNCTION
module.exports = extractUserId;