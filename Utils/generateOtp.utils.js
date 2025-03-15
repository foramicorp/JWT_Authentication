// FUNCTION TO GENERATE OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

// EXPORT THE FUNCTION
module.exports = generateOtp;
