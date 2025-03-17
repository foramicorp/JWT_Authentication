// IMPORTING THE REQUIREMENTS
const mongoose = require("mongoose")

// CREATING THE USER MODEL WITH MONGOOSE SCHEMA
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    isDeleted: { type: Boolean, default: false },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });


// EXPORTING THE USER MODEL FOR USE IN OTHER FILES
const User = mongoose.model("User", userSchema);

module.exports = User;

