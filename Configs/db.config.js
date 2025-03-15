const mongoose = require("mongoose");
require("dotenv").config();

const dbconnect = async (req , res) => {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to database");
}

module.exports = dbconnect;