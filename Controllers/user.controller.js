// IMPORTING REQUIREMENTS
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../Models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../Utils/generateToken.utils");
const sendMail = require("../Configs/mailer.config");
const generateOtp = require("../Utils/generateOtp.utils");


// USER SIGNUP CONTROLLER 
const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // VALUE CAN NOT BE NULL 
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        // FINDING IF USER EXISTS OR NOT 
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists");
        }

        // HASHING THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATING A NEW USER AND SAVING IT IN DATABASE
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully");

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
// GET ALL USER CONTROLLER 
const getAllUser = async (req, res) => {
    try {
        // GETTING ALL USERS FROM THE DATABASE
        const users = await User.find({isDeleted:false});
        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

// GET USER BY ID CONTROLLER 
const getUserById = async (req, res) => {
    try {

        // GETTING USER BY ID FROM THE DATABASE
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}
// UPDATE USER CONTROLLER 

const updateUser = async (req, res) => {
    try {

        // GETTING USER BY ID FROM THE DATABASE
        const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
        res.json({ message: "Login and try again " });


    }
}
// DELETE USER CONTROLLER (SOFT DELETE)

const softDeleteUser = async (req, res) => {
    try {

        // GETTING USER BY ID FROM THE DATABASE
        const user = await User.findByIdAndUpdate(req.userId , {isDeleted : true } );

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}

// DELETE USER CONTROLLER (HARD DELETE)

const hardDeleteUser = async (req, res) => {
    try {

        // FINDING IS USER EXISTS 
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}

// LOGIN USER CONTROLLER      
const loginUser = async (req, res) => {
    try {

        // FINDING IS USER EXISTS 
        const { email, password } = req.body;
        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // COMPARING THE PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // GENERATING TOKENS
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        console.log("Generated Refresh Token:", refreshToken);

        // UPDATING USER MODEL WITH REFRESH TOKEN
        user.refreshToken = refreshToken;
        await user.save();

        console.log("User After Saving Refresh Token:", await User.findOne({ email }));

        // SETTING COOKIES
  
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
        res.cookie("userId", user._id.toString(), { httpOnly: true, secure: true, sameSite: "Strict" });
        res.json({ message: "Login successful", accessToken });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// REFRESH TOKEN CONTROLLER
const refreshToken = async (req, res) => {
    try {
        console.log("Cookies Received:", req.cookies);

        // CHECK FOR REFRESH TOKEN
        if (!req.cookies || !req.cookies.refreshToken) {
            return res.status(401).json({ message: "No refresh token found" });
        }

        const refreshToken = req.cookies.refreshToken;
        console.log("Received Refresh Token:", refreshToken);

        // FIND USER WITH REFRESH TOKEN 
        const user = await User.findOne({ refreshToken });
        console.log("User Found in DB:", user);

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token (User not found)" });
        }

        // GENERATING NEW ACCESS TOKEN

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ message: "Invalid Refresh Token" });
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ message: "Token refreshed", accessToken: newAccessToken });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// FORGOT PASSWORD CONTROLLER 
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // CHECKING USER EXISTS
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // GENERATING OTP AND SENDING MAIL
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        await sendMail(email, "Password Reset OTP", `Your OTP is ${otp}. It expires in 10 minutes.`);

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// RESET PASSWORD CONTROLLER 
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    // CHECKING USER EXISTS AND OTP IS VALID
    try {
        const user = await User.findOne({ email, otp });
        if (!user || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // HASHING NEW PASSWORD
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // SEND PASSWORD RESET CONFIRMATION MAIL
        await sendMail(
            user.email,
            "Password Reset Confirmation",
            `Hello ${user.name},\n\nYour password has been successfully reset. If you did not make this change, please contact support immediately.\n\nThank you!`
        );

        res.json({ message: "Password reset successful. A confirmation email has been sent." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGOUT CONTROLLER 
const logoutUser = async (req, res) => {
    try {
        // CHECK IF REFRESH TOKEN IS PROVIDED IN COOKIES
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token provided" });
        }

        // FIND THE USER WITH REFRESH TOKEN 
        const user = await User.findOne({ refreshToken });
        console.log("User found for logout:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token (User not found)" });
        }

        // REMOVE REFRESH TOKEN 
        user.refreshToken = null;
        await user.save();

        // CLEAR REFRESH TOKEN FROM COOKIES 
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });
        res.clearCookie("userId", { httpOnly: true, secure: true, sameSite: "Strict" });

        res.json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// EXPORTING THE CONTROLLERS 
module.exports = {
    signupUser,
    getAllUser,
    getUserById,
    loginUser,
    refreshToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
};
