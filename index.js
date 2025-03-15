// IMPORTING REQUIREMENTS
const express = require("express");
const dbconnect = require("./Configs/db.config");
const userRouter = require("./Routes/user.route");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

// WELCOME ROUTES
app.get("/" , (req, res) => {
    res.send("Welcome to the api");
});

// USER ROUTES
app.use("/api/user", userRouter);

// STARTING THE SERVER ON PORT 8000
app.listen(8000, ()=> {
    console.log("server is runnong on 8000");
    dbconnect();
});

