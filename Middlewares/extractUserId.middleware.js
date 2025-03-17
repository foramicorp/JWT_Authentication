const extractUserId = (req, res, next) => {
    const userId = req.cookies.userId; 

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found in cookies" });
    }

    req.userId = userId; 
    next();
};

module.exports = extractUserId;