// IMPORTING REQUIREMENTS
const mongoose = require("mongoose");
require("dotenv").config();

// FUNCTION TO CONNECT TO MONGODB DATABASE
const dbconnect = async (req , res) => {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to database");
}

// EXPORTING THE FUNCTION
module.exports = dbconnect;