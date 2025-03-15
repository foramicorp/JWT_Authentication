const express = require("express");
const dbconnect = require("./Configs/db.config");
const userRouter = require("./Routes/user.route");
const app = express();
app.use(express.json());

app.get("/" , (req, res) => {
    res.send("Welcome to the api");
});

app.use("/api/user", userRouter);

app.listen(8000, ()=> {
    console.log("server is runnong on 8000");
    dbconnect();
});

