const Router = require("express");
const { getAllUser, getUserById, signupUser, loginUser } = require("../Controllers/user.controller");
const isToken = require("../Middlewares/authToken.middleware");
const userRouter = Router();

userRouter.get("/get-alluser" , getAllUser);
userRouter.get("/get-userbyid/:id" , isToken , getUserById);
userRouter.post("/signup-user" , signupUser);
userRouter.post("/login-user" , loginUser);

module.exports = userRouter;