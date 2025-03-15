const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model");
const generateAccessToken = require("../Utils/generateToken.utils");
const generateRefreshToken = require("../Utils/generateToken.utils");

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully");

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

const getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
        res.json({ message: "Login successful", token })

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

const refreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json(error.message);
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json(error.message);
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err)
                return res.status(403).json({ message: "Invalid Refresh Token" });

            const newaccessToken = generateAccessToken(user);
            res.json({ message: "Token refreshed", token: newAccessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


module.exports = {
    signupUser,
    getAllUser,
    getUserById,
    loginUser,
    refreshToken,
 };
